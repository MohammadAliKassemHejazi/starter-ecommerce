import { NextFunction, Request, Response } from 'express';
import * as PaymentService from '../services/payment.service';
import { IPaymentResponse } from '../interfaces/types/controllers/payment.controller.types';
import { CustomRequest } from 'interfaces/types/middlewares/request.middleware.types';

// Initiate a payment
export const initiatePayment = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.UserId ?? "";
    const { amount, currency, paymentMethodId } = req.body;
    const paymentResponse: IPaymentResponse = await PaymentService.processPayment(
      amount,
      currency,
      paymentMethodId,
      userId
    );
    res.status(200).json(paymentResponse); // Return clientSecret to frontend
  } catch (error) {
    next(error);
  }
};

// Handle Stripe webhook events
export const handleWebhook = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const signature = req.headers['stripe-signature'] as string;
    
  
    const rawBody = req.rawBody as Buffer;

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