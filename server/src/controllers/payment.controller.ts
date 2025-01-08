import { NextFunction, Request, Response } from 'express';
import * as PaymentService from '../services/payment.service';
import { IPaymentResponse } from '../interfaces/types/controllers/payment.controller.types';

// Initiate a payment
export const initiatePayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { amount, currency, paymentMethodId } = req.body;
    const paymentResponse: IPaymentResponse = await PaymentService.processPayment(
      amount,
      currency,
      paymentMethodId
    );
    res.status(200).json(paymentResponse); // Return clientSecret to frontend
  } catch (error) {
    next(error);
  }
};

// Handle Stripe webhook events
export const handleWebhook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const signature = req.headers['stripe-signature'] as string;
    const rawBody = req.body; // This is the raw request body

    // Verify the webhook
    const event = PaymentService.verifyWebhook(rawBody, signature);

    // Handle the webhook event
    await PaymentService.handleWebhookEvent(event);

    res.status(200).json({ received: true });
  } catch (error) {
    next(error);
  }
};

export default {
  initiatePayment,
  handleWebhook,
};