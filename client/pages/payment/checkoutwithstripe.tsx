import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY ?? "");

interface CheckoutFormProps {
  amount: number;
  currency: string;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ amount, currency }) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();


const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  setLoading(true);

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
    // Create a payment method using Stripe Elements
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      setError(error.message || "An error occurred during payment method creation.");
      setLoading(false);
      return;
    }

    if (!paymentMethod) {
      setError("Failed to create a payment method.");
      setLoading(false);
      return;
    }

    // Send payment details to the backend
    const response = await fetch('/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency,
        paymentMethodId: paymentMethod.id,
      }),
    });

    const { clientSecret } = await response.json();

    // Confirm the PaymentIntent on the frontend
    const { error: confirmError } = await stripe.confirmPayment({
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`, // Redirect URL after payment
      },
    });

    if (confirmError) {
      setError(confirmError.message || "Payment confirmation failed.");
    } else {
      // Payment succeeded, handle success
      alert('Payment successful!');
    }
  } catch (err) {
    setError(err instanceof Error ? err.message : "An unexpected error occurred.");
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
        Pay {amount} {currency}
      </button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
};

interface CheckoutPageProps {
  amount: number;
  currency: string;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ amount, currency }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm amount={amount} currency={currency} />
    </Elements>
  );
};

export default CheckoutPage;