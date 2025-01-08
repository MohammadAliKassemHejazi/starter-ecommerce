import stripe from 'stripe';
import config from '../config/config';
import customError from '../utils/customError';
import paymentErrors from '../utils/errors/payment.errors';
import { IPaymentResponse } from '../interfaces/types/controllers/payment.controller.types';

const stripeClient = new stripe(config.Stripekey as string, {
  apiVersion: '2024-06-20',
});

// Process payment and create a PaymentIntent
export const processPayment = async (
  amount: number,
  currency: string,
  paymentMethodId: string
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
    });

    return {
      body: {
        status: 'success',
        transactionId:paymentIntent.id,
        clientSecret: paymentIntent.client_secret ?? "", // Return clientSecret for frontend confirmation
      },
    };
  } catch (error) {
    console.error('Payment processing error:', error);
    throw customError(paymentErrors.PaymentFailed);
  }
};

// Verify Stripe webhook events
export const verifyWebhook = (body: any, signature: any) => {
  try {
    return stripeClient.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('Webhook verification failed:', error);
    throw new Error('Webhook verification failed.');
  }
};

// Handle Stripe webhook events
export const handleWebhookEvent = async (event: any): Promise<void> => {
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log(`PaymentIntent for ${paymentIntent.id} succeeded.`);
        // Update your database or state here
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    console.error('Webhook processing error:', error);
    throw customError(paymentErrors.WebhookVerificationFailed);
  }
};

export default {
  processPayment,
  verifyWebhook,
  handleWebhookEvent,
};