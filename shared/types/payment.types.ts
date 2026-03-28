import { ApiResponse } from './apiResponse.types';

// Payment entity shape
export interface IPayment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethodId: string;
  paymentIntentId?: string;
  clientSecret?: string;
  orderId?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Payment API Response Types
export interface PaymentResponse extends ApiResponse<IPayment> {}

export interface CreatePaymentResponse extends ApiResponse<IPayment> {}

export interface PaymentIntentResponse extends ApiResponse<{
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
  status: string;
}> {}

export interface ConfirmPaymentResponse extends ApiResponse<{
  id: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethodId: string;
  paymentIntentId: string;
  orderId?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}> {}

export interface RefundPaymentResponse extends ApiResponse<{
  id: string;
  amount: number;
  currency: string;
  status: string;
  refundId: string;
  paymentId: string;
  reason?: string;
  createdAt: string;
  updatedAt: string;
}> {}
