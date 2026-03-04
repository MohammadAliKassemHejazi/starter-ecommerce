export interface CheckoutFormViewModel {
  amount: number;
  currency: string;
  onSuccess?: (paymentId: string) => void;
  onError?: (error: string) => void;
  packageId?: string;
  type?: 'cart' | 'package';
}

export interface CheckoutPageViewModel {
  package?: {
    id: string;
    name: string;
    price: number;
  };
}
