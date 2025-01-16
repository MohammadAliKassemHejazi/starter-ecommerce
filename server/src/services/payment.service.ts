import stripe from "stripe";
import config from "../config/config";
import customError from "../utils/customError";
import paymentErrors from "../utils/errors/payment.errors";
import { IPaymentResponse } from "../interfaces/types/controllers/payment.controller.types";
import db from "../models"; // Import your database models
import { raw } from "body-parser";


const stripeClient = new stripe(config.Stripekey as string, {
  apiVersion: "2024-06-20",
});

// Process payment and create a PaymentIntent
export const processPayment = async (
  amount: number,
  currency: string,
  paymentMethodId: string,
  userId: string
): Promise<IPaymentResponse> => {
  try {
    // Fetch the user's cart
    const cart = await db.Cart.findOne({
      where: { userId },
      include: [
        {
          model: db.CartItem,
          include: [
            {
              model: db.Product,
              include: [db.ProductImage], // Include product images
            },
            {
              model: db.SizeItem, // Include size information
              include: [db.Size], // Include size details
            },
          ],
        },
      ],
    });

    // If the cart is not found, throw an error
    if (!cart) {
      throw customError({
        message: `Cart not found`,
        code: "CART_NOT_FOUND",
        statusCode: 400,
      });
    }

    // Validate cart items to ensure quantities do not exceed available stock
    for (const cartItem of cart.CartItems) {
      const sizeItem = await db.SizeItem.findOne({
        where: {
          productId: cartItem.productId,
          id: cartItem.sizeItemId,
        },
      });

      // If the SizeItem does not exist, throw an error
      if (!sizeItem) {
        throw customError({
          message: `SizeItem not found for product ${cartItem.Product.name} (Size: ${cartItem.SizeItem.Size.size})`,
          code: "SIZE_ITEM_NOT_FOUND",
          statusCode: 400,
        });
      }

      // If the requested quantity exceeds the available stock, throw an error
      if (sizeItem.quantity < cartItem.quantity) {
        throw customError({
          message: `Insufficient stock for product ${cartItem.Product.name} (Size: ${cartItem.SizeItem.Size.size}). Available: ${sizeItem.quantity}, Requested: ${cartItem.quantity}`,
          code: "INSUFFICIENT_STOCK",
          statusCode: 400,
        });
      }
    }

    // Convert amount to cents
    const amountInCents = Math.round(amount * 100);

    // Create a PaymentIntent with Stripe
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: amountInCents,
      currency,
      payment_method: paymentMethodId,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId, // Store userId in metadata for webhook handling
      },
    });

    // Save the payment intent in the database
    await db.Payment.create({
      paymentIntentId: paymentIntent.id,
      amount: amount,
      currency,
      status: "pending", // Default status
      userId,
    });

    // Return the payment response
    return {
      body: {
        status: "success",
        transactionId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret ?? "", // Return clientSecret for frontend confirmation
      },
    };
  } catch (error) {
    console.error("Payment processing error:", error);
    throw customError(paymentErrors.PaymentFailed);
  }
};

export const verifyWebhook = (rawBody: Buffer | string, signature: string) => {
  try {
    console.log();
    return stripeClient.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET! // Use your webhook secret
    );
  } catch (error) {
    console.error("Webhook verification failed:", error);
    throw new Error("Webhook verification failed.");
  }
};

// Handle Stripe webhook events
export const handleWebhookEvent = async (event: any): Promise<void> => {
  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        const userId = paymentIntent.metadata.userId;

        const transaction = await db.sequelize.transaction();

        try {
          // Fetch the user's cart
          const cart = await db.Cart.findOne({
            where: { userId },
            include: [
              {
                model: db.CartItem,
                include: [
                  {
                    model: db.Product,
                    include: [db.ProductImage], // Include product images
                  },
                  {
                    model: db.SizeItem, // Include size information
                    include: [db.Size], // Include size details
                  },
                ],
              },
            ],
            transaction, // Pass the transaction
          });

          // If the cart is not found, throw a custom error
          if (!cart) {
            throw new Error("CART not found");
          }

          // Convert the Sequelize instance to a plain object
          const plainCart = cart.toJSON();

          // Fetch the payment record
          const payment = await db.Payment.findOne({
            where: { paymentIntentId: paymentIntent.id },
            raw: true,
            transaction, // Pass the transaction
          });

          if (!payment) {
            throw new Error("Payment not found");
          }

          // Create an order
          const order = await db.Order.create(
            {
              userId,
              paymentId: payment.id,
            },
            
            { transaction } // Pass the transaction
          );

          // Add order items and update SizeItem quantities
          for (const item of plainCart.CartItems) {
            // Create the order item
            await db.OrderItem.create(
              {
                orderId: order.dataValues.id,
                productId: item.productId,
                quantity: item.quantity,
                price: item.Product.price, // Assuming price is stored in the cart item
              },
              { transaction } // Pass the transaction
            );

            // Update the SizeItem quantity
            const sizeItem = await db.SizeItem.findOne({
              where: {
                id: item.sizeItemId,
              },
              transaction, // Pass the transaction
            });

            if (!sizeItem) {
              throw new Error(`SizeItem not found for product ${item.productId}`);
            }

            // Subtract the purchased quantity
            sizeItem.quantity -= item.quantity;

            // If the quantity reaches 0, delete the SizeItem
            if (sizeItem.quantity <= 0) {
              await sizeItem.destroy({ transaction });
            } else {
              // Otherwise, save the updated quantity
              await sizeItem.save({ transaction });
            }
          }

          // Clear the cart
          await db.CartItem.destroy({
            where: { cartId: plainCart.id },
            transaction, // Pass the transaction
          });

          // Update the payment status
          await db.Payment.update(
            { status: "succeeded" },
            { where: { paymentIntentId: paymentIntent.id }, transaction } // Pass the transaction
          );

          // Commit the transaction
          await transaction.commit();

          console.log(
            `PaymentIntent for ${paymentIntent.id} succeeded. Order created: ${order.id}`
          );
        } catch (error) {
          // Rollback the transaction in case of error
          await transaction.rollback();
          throw error;
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    console.error("Webhook processing error:", error);
    throw customError(paymentErrors.WebhookVerificationFailed);
  }
};

export default {
  processPayment,
  verifyWebhook,
  handleWebhookEvent,
};
