export interface IPaymentAttributes {
  id: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
  status: string;
  customerId?: string; // Optional field for customer ID
  createdAt?: Date;
  updatedAt?: Date;
}