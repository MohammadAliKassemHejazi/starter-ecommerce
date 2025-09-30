import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAppDispatch } from '@/store/store';
import { createPayment } from '@/store/slices/paymentSlice';
import CheckoutGuard from '@/components/Guards/CheckoutGuard';
import { PageLayout } from '@/components/UI/PageComponents';
import { showToast } from '@/components/UI/PageComponents/ToastConfig';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_Stripe_Key ?? "");

interface CheckoutFormProps {
  amount: number;
  currency: string;
  onSuccess?: (paymentId: string) => void;
  onError?: (error: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ amount, currency, onSuccess, onError }) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useAppDispatch();

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
      const paymentData = {
        amount: amount * 100, // Convert to cents
        currency: currency.toLowerCase(),
        paymentMethodId: paymentMethod.id,
      };

      const result = await dispatch(createPayment(paymentData));
      
      if (result.meta.requestStatus === 'fulfilled' && result.payload && typeof result.payload === 'object' && 'id' in result.payload) {
        const paymentId = String(result.payload.id);
        showToast.success('Payment successful!');
        onSuccess?.(paymentId);
      } else {
        throw new Error(typeof result.payload === 'string' ? result.payload : 'Payment failed');
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