// backend/controllers/app.controller.ts

import { Request, Response } from "express";
import * as PaymentService from "../services/payment.service";

import { IPaymentResponse } from "../interfaces/types/controllers/payment.controller.types";
import customError from "../utils/customError";

import paymentErrors from "../utils/errors/payment.errors";



// Payment Controller
export const initiatePayment = async (req: Request, res: Response) => {
  try {
    const { amount, currency, paymentMethodId } = req.body;
    const paymentResponse: IPaymentResponse = await PaymentService.processPayment(amount, currency, paymentMethodId);
    res.status(paymentResponse.body.status === "success" ? 200 : 400).json(paymentResponse);
  } catch (error) {
    console.log(error)  
    res.status(400).json(customError(paymentErrors.PaymentFailed));
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  try {
    const event = req.body;
    const webhookResponse = await PaymentService.handleWebhookEvent(event);
    res.status(200).json(webhookResponse);
  } catch (error) {
    res.status(400).json(customError(paymentErrors.WebhookVerificationFailed));
  }
};

// Exporting All Controller Functions
export default {
  initiatePayment,
  handleWebhook
};
