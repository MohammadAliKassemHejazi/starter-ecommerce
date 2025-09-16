import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAppDispatch } from '@/store/store';
import { createPayment } from '@/store/slices/paymentSlice';
import CheckoutGuard from '@/components/Guards/CheckoutGuard';

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

      if (!paymentMethod) {
        setError("Failed to create a payment method.");
        setLoading(false);
        return;
      }

      // Step 2: Dispatch the Redux thunk to create a payment intent
      const paymentDetails = {
        amount,
        currency,
        paymentMethodId: paymentMethod.id,
      };

      const response = await dispatch(createPayment(paymentDetails));

      // Check if the payment creation was successful
      if (createPayment.fulfilled.match(response)) {
        const clientSecret = response.payload.clientSecret; // Access clientSecret from the response

        // Step 3: Confirm the payment using the clientSecret from the backend
        const { error: confirmError } = await stripe.confirmPayment({
          clientSecret, // Use the clientSecret from the response
          confirmParams: {
            return_url: `${window.location.origin}/payment-success`, // Redirect URL after payment
          },
        });

        if (confirmError) {
          const errorMessage = confirmError.message || "Payment confirmation failed.";
          setError(errorMessage);
          onError?.(errorMessage);
        } else {
          // Payment succeeded, handle success
          onSuccess?.(paymentMethod.id);
          alert('Payment successful!');
        }
      } else if (createPayment.rejected.match(response)) {
        const errorMessage = response.payload || "Failed to process payment.";
        setError(errorMessage);
        onError?.(errorMessage);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }}
      />
      <button type="submit" disabled={!stripe || loading}>
        {loading ? 'Processing...' : `Pay ${amount} ${currency}`}
      </button>
      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
    </form>
  );
};

interface CheckoutPageProps {
  amount: number;
  currency: string;
  onSuccess?: (paymentId: string) => void;
  onError?: (error: string) => void;
}
// implement the success and error handlers if needed

const CheckoutPage: React.FC<CheckoutPageProps> = ({ amount, currency ,onSuccess ,onError}) => {
  return (
    <CheckoutGuard>
      <Elements stripe={stripePromise}>
        <CheckoutForm amount={amount} currency={currency} onError={onError} onSuccess={onSuccess} />
      </Elements>
    </CheckoutGuard>
  );
};

export default CheckoutPage;