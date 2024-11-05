// backend/services/paymentService.ts
import stripe from 'stripe';
import config from '../config/config';
import customError from '../utils/customError';
import paymentErrors from '../utils/errors/payment.errors';
import webhookErrors from '../utils/errors/payment.errors';
import { IPaymentResponse } from '../interfaces/types/controllers/payment.controller.types';

const stripeClient = new stripe(config.Stripekey as string, {
  apiVersion: '2024-06-20',
});

// Function to process customer payments

export const processPayment = async (amount: number, currency: string, paymentMethodId: string): Promise<IPaymentResponse> => {
  try {
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount, // e.g., $50.00 (5000 cents)
      currency,
      payment_method: paymentMethodId,
      confirmation_method: 'manual',
      confirm: true,
    });

    if (paymentIntent.status === 'succeeded') {
        return { body:{ status: 'success', transactionId: paymentIntent.id } };
    } else {
      throw customError(paymentErrors.PaymentFailed);
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    throw customError(paymentErrors.PaymentFailed);
  }
};

// Function to verify and process Stripe webhook events
export const handleWebhookEvent = (event: any): void => {
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log(`PaymentIntent for ${paymentIntent.id} succeeded.`);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    console.error('Webhook processing error:', error);
    throw customError(webhookErrors.WebhookVerificationFailed);
  }
};

export default {

    processPayment,
  handleWebhookEvent
};
