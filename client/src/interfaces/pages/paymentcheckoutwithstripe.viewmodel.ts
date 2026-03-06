// Auto-generated View Model for PaymentCheckoutwithstripe Page
export interface CheckoutFormProps {
  amount: number;
  currency: string;
  onSuccess?: (paymentId: string) => void;
  onError?: (error: string) => void;
  packageId?: string;
  type?: 'cart' | 'package';
}

export interface CheckoutPageProps {
  package: {
    id: string;
    name: string;
    price: number;
  };
  onSuccess?: (paymentId: string) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
}

export interface IPaymentCheckoutwithstripePageViewModel {
    // Add properties for PaymentCheckoutwithstripe view model
}
