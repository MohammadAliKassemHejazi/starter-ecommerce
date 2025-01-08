// backend/controllers/app.controller.ts

import { NextFunction, Request, Response } from "express";
import * as PaymentService from "../services/payment.service";

import { IPaymentResponse } from "../interfaces/types/controllers/payment.controller.types";




// Payment Controller
export const initiatePayment = async (req: Request, res: Response, next : NextFunction) => {
  try {
    const { amount, currency, paymentMethodId } = req.body;
    const paymentResponse: IPaymentResponse = await PaymentService.processPayment(amount, currency, paymentMethodId);
    res.status(paymentResponse.body.status === "success" ? 200 : 400).json(paymentResponse);
  } catch (error) {
    
    next(error);
  }
};


export const handleWebhook = async (req: Request, res: Response, next : NextFunction) => {
  try {
    const signature = req.headers["stripe-signature"];
    const event = PaymentService.verifyWebhook(req.body, signature);
    const webhookResponse = await PaymentService.handleWebhookEvent(event);
    res.status(200).json(webhookResponse);
  } catch (error) {
  next(error);
  }
};

// Exporting All Controller Functions
export default {
  initiatePayment,
  handleWebhook
};
