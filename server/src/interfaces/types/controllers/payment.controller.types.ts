

export interface IPaymentResponse  {
   
  body: {
    status: string;                 // "success" or "failure"
    transactionId: string;
    clientSecret: string;// ID of the transaction, if successful
    // amount?: number;                 // Amount processed
    // currency?: string;               // Currency code (e.g., "USD")
    // paymentMethod?: string;         // Type of payment method used (e.g., "card")
    // error?: string;                 // Error message if the payment failed
  };
}
