import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAppDispatch } from '@/store/store';
import { createPayment } from '@/store/slices/paymentSlice';
import CheckoutGuard from '@/components/Guards/CheckoutGuard';
import { PageLayout } from '@/components/UI/PageComponents';
import { showToast } from '@/components/UI/PageComponents/ToastConfig';
import { purchasePackage } from '@/services/packageService';
import { useAnalyticsTracker } from '@/hooks/useAnalyticsTracker';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_Stripe_Key ?? "");

export interface CheckoutFormProps {
  amount: number;
  currency: string;
  onSuccess?: (paymentId: string) => void;
  onError?: (error: string) => void;
  packageId?: string; // Optional: Only for package purchases
  type?: 'cart' | 'package'; // Optional: Defaults to 'cart' if not provided
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  amount,
  currency,
  onSuccess,
  onError,
  packageId,
  type = 'cart'
}) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useAppDispatch();
  const { trackEvent } = useAnalyticsTracker();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      setError("Stripe has not loaded yet.");
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Card element is not available.");
      setLoading(false);
      return;
    }

    try {
      // Step 1: Create a payment method using Stripe Elements
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (stripeError) {
        setError(stripeError.message || "An error occurred during payment method creation.");
        setLoading(false);
        return;
      }

      // Step 2: Create payment intent on your backend
      // Handle different payment types
      if (type === 'package' && packageId) {
        // Use the new package purchase service
        const response = await purchasePackage(packageId, amount, currency.toLowerCase(), paymentMethod.id);

        if (response.body && response.body.status === 'success') {
          const paymentId = response.body.transactionId;
          showToast.success('Package subscription successful!');

          trackEvent('purchase', {
            type: 'package',
            packageId,
            amount,
            currency,
            transactionId: paymentId
          });

          onSuccess?.(paymentId);
        } else {
           throw new Error('Package subscription failed');
        }

      } else {
        // Default to Cart payment (existing logic)
        const paymentData = {
          amount: amount * 100, // Convert to cents
          currency: currency.toLowerCase(),
          paymentMethodId: paymentMethod.id,
        };

        const result = await dispatch(createPayment(paymentData));

        if (result.meta.requestStatus === 'fulfilled' && result.payload && typeof result.payload === 'object' && 'clientSecret' in result.payload) {
          showToast.success('Payment successful!');

          trackEvent('purchase', {
            type: 'cart',
            amount,
            currency
          });

          onSuccess?.('payment-succeeded');
        } else {
          throw new Error(typeof result.payload === 'string' ? result.payload : 'Payment failed');
        }
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="needs-validation">
      <div className="mb-3">
        <label htmlFor="card-element" className="form-label">
          Credit or Debit Card
        </label>
        <div className="border rounded p-3">
          <CardElement
            id="card-element"
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: 'var(--bs-body-color)',
                  '::placeholder': {
                    color: 'var(--bs-text-muted)',
                  },
                },
                invalid: {
                  color: 'var(--bs-danger)',
                },
              },
            }}
          />
        </div>
        {error && (
          <div className="text-danger mt-2">
            <i className="bi bi-exclamation-circle me-1"></i>
            {error}
          </div>
        )}
      </div>

      <div className="d-grid gap-2">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!stripe || loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Processing...
            </>
          ) : (
            <>
              <i className="bi bi-credit-card me-2"></i>
              Pay ${amount} {currency.toUpperCase()}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

interface CheckoutPageProps {
  package: {
    id: string;
    name: string;
    price: number;
  };
  onSuccess?: (paymentId: string) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ 
  package: pkg, 
  onSuccess, 
  onError, 
  onCancel 
}) => {
  return (
    <CheckoutGuard>
      <PageLayout 
        title="Checkout" 
        subtitle={`Complete your subscription to ${pkg.name}`}
        protected={true}
      >
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Payment Details</h5>
              </div>
              <div className="card-body">
                <div className="mb-4">
                  <h6>Package: {pkg.name}</h6>
                  <h4 className="text-primary">${pkg.price}/month</h4>
                </div>
                
                <Elements stripe={stripePromise}>
                  <CheckoutForm
                    amount={pkg.price}
                    currency="usd"
                    packageId={pkg.id}
                    type="package"
                    onSuccess={onSuccess}
                    onError={onError}
                  />
                </Elements>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    </CheckoutGuard>
  );
};

export default CheckoutPage;
