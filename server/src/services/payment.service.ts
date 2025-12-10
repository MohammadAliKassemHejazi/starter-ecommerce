import stripe from "stripe";
import config from "../config/config";
import customError from "../utils/customError";
import paymentErrors from "../utils/errors/payment.errors";
import { IPaymentResponse } from "../interfaces/types/controllers/payment.controller.types";
import db from "../models"; // Import your database models
import { activatePackage } from "./package.service";
import { raw } from "body-parser";


const stripeClient = new stripe(config.Stripekey as string, {
  apiVersion: "2024-06-20",
});

// Process cart payment and create a PaymentIntent
export const processCartPayment = async (
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
        type: 'cart', // Identify payment type
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
    console.error("Cart payment processing error:", error);
    throw customError(paymentErrors.PaymentFailed);
  }
};

// Process package payment and create a PaymentIntent
export const processPackagePayment = async (
  amount: number,
  currency: string,
  paymentMethodId: string,
  userId: string,
  packageId: string
): Promise<IPaymentResponse> => {
  try {
    // Validate package existence
    const packageData = await db.Package.findByPk(packageId);
    if (!packageData) {
      throw customError({
        message: `Package not found`,
        code: "PACKAGE_NOT_FOUND",
        statusCode: 404,
      });
    }

    if (!packageData.isActive) {
      throw customError({
        message: `Package is not active`,
        code: "PACKAGE_NOT_ACTIVE",
        statusCode: 400,
      });
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
        userId,
        type: 'package',
        packageId,
      },
    });

    // Save the payment intent in the database
    await db.Payment.create({
      paymentIntentId: paymentIntent.id,
      amount: amount,
      currency,
      status: "pending",
      userId,
    });

    return {
      body: {
        status: "success",
        transactionId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret ?? "",
      },
    };
  } catch (error) {
    console.error("Package payment processing error:", error);
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

const handleCartPaymentSuccess = async (paymentIntent: any, transaction: any) => {
  const userId = paymentIntent.metadata.userId;

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
    transaction,
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
    transaction,
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
    { transaction }
  );

  // Add order items and update SizeItem quantities
  for (const item of plainCart.CartItems) {
    // Create the order item
    await db.OrderItem.create(
      {
        orderId: order.dataValues.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.Product.price,
      },
      { transaction }
    );

    // Update the SizeItem quantity
    const sizeItem = await db.SizeItem.findOne({
      where: {
        id: item.sizeItemId,
      },
      transaction,
    });

    if (!sizeItem) {
      throw new Error(`SizeItem not found for product ${item.productId}`);
    }

    // Subtract the purchased quantity
    sizeItem.dataValues.quantity -= item.quantity;

    // If the quantity reaches 0, delete the SizeItem
    if (sizeItem.dataValues.quantity <= 0) {
      await sizeItem.destroy({ transaction });
    } else {
      // Otherwise, save the updated quantity
      await sizeItem.save({ transaction });
    }
  }

  // Clear the cart
  await db.CartItem.destroy({
    where: { cartId: plainCart.id },
    transaction,
  });

  console.log(`Cart payment succeeded for user ${userId}. Order created: ${order.id}`);
};

const handlePackagePaymentSuccess = async (paymentIntent: any, transaction: any) => {
  const userId = paymentIntent.metadata.userId;
  const packageId = paymentIntent.metadata.packageId;

  if (!packageId) {
    throw new Error("Package ID missing in payment metadata");
  }

  // Activate the package for the user using the existing service
  // Note: activatePackage handles its own transaction internally if called directly,
  // but since we are already in a transaction here, we might need to be careful.
  // Looking at activatePackage in package.service.ts, it creates its own transaction:
  // const transaction = await db.sequelize.transaction();
  // Nesting transactions in Sequelize usually requires passing the transaction object explicitly.
  // However, since `activatePackage` is designed to be standalone, we should probably check if we can pass a transaction to it
  // or replicate the logic here.

  // Replicating logic here to ensure atomicity with the payment update
  // Get package
  const packageData = await db.Package.findByPk(packageId, { transaction });
  if (!packageData) {
    throw new Error('Package not found');
  }

  // Check if user already has an active package
  const existingUserPackage = await db.UserPackage.findOne({
    where: {
      userId,
      isActive: true
    },
    transaction
  });

  // If user has an active package, deactivate it
  if (existingUserPackage) {
    await existingUserPackage.update({ isActive: false }, { transaction });
  }

  // Create new user package
  await db.UserPackage.create({
    userId,
    packageId,
    isActive: true,
    startDate: new Date(),
    // Set end date if needed (e.g., for subscription-based packages)
    // endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  }, { transaction });

  console.log(`Package payment succeeded for user ${userId}. Package ${packageId} activated.`);
};

// Handle Stripe webhook events
export const handleWebhookEvent = async (event: any): Promise<void> => {
  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        const transaction = await db.sequelize.transaction();

        try {
          const type = paymentIntent.metadata.type || 'cart'; // Default to 'cart' for backward compatibility

          if (type === 'cart') {
            await handleCartPaymentSuccess(paymentIntent, transaction);
          } else if (type === 'package') {
            await handlePackagePaymentSuccess(paymentIntent, transaction);
          } else {
             console.warn(`Unknown payment type: ${type}`);
          }

          // Update the payment status common for all types
           await db.Payment.update(
            { status: "succeeded" },
            { where: { paymentIntentId: paymentIntent.id }, transaction }
          );

          // Commit the transaction
          await transaction.commit();
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
  processCartPayment,
  processPackagePayment,
  verifyWebhook,
  handleWebhookEvent,
};
