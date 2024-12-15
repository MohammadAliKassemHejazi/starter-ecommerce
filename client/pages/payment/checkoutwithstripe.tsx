import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { createPayment } from '@/store/slices/paymentSlice'; // Import the action
import { useAppDispatch } from '@/store/store';

const CheckoutForm: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useAppDispatch();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      setError('Stripe has not loaded yet.');
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError('Card element is not available.');
      setLoading(false);
      return;
    }

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        setError(error.message || 'An error occurred during payment method creation.');
        setLoading(false);
        return;
      }

      if (!paymentMethod) {
        setError('Failed to create a payment method.');
        setLoading(false);
        return;
      }

      // Dispatch the createPayment action to make the backend call
      const resultAction = await dispatch(createPayment(paymentMethod.id));

      if (createPayment.rejected.match(resultAction)) {
        setError(resultAction.payload as string);
      } else {
        alert('Payment successful!');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe || loading}>
        Pay Now
      </button>
      {error && <div>{error}</div>}
    </form>
  );
};

export default CheckoutForm;
