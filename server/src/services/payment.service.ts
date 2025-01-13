import stripe from "stripe";
import config from "../config/config";
import customError from "../utils/customError";
import paymentErrors from "../utils/errors/payment.errors";
import { IPaymentResponse } from "../interfaces/types/controllers/payment.controller.types";
import db from "../models"; // Import your database models
import { Transaction } from "sequelize";
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
    const amountInCents = Math.round(amount * 100); // Convert amount to cents
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
                ],
              },
            ],
          });

          // If the cart is not found, throw a custom error
          if (!cart) {
            throw new Error("CART not found");
          }

          // Convert the Sequelize instance to a plain object
          const plainCart = cart.toJSON();

          const payment = await db.Payment.findOne({
            where: { paymentIntentId: paymentIntent.id },
            raw: true,
            transaction, // Pass the transaction
          });

          if (!payment) {
            throw new Error("payment not found");
          }
          // Create an order
          const order = await db.Order.create(
            {
              userId,
              paymentId: payment.id,
            },

            { transaction,raw:true } // Pass the transaction
          );
          const JSONorder = order.toJSON()
          // Add order items
          for (const item of plainCart.CartItems) {
            await db.OrderItem.create(
              {
                orderId: JSONorder.id,
                productId: item.productId,
                quantity: item.quantity,
                price: item.Product.price, // Assuming price is stored in the cart item
              },
              { transaction } // Pass the transaction
            );
          }

          // Clear the cart
          await db.CartItem.destroy({
            where: { cartId: plainCart.id },
            transaction,
          }); // Pass the transaction

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
