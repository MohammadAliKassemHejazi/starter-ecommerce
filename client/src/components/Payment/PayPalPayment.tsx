import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useAppDispatch } from '@/store/store';
import { createPayPalOrder, capturePayPalOrder } from '@/store/slices/paymentSlice';

interface PayPalPaymentProps {
  amount: number;
  currency: string;
  onSuccess?: (paymentId: string) => void;
  onError?: (error: string) => void;
}

const PayPalButtonWrapper: React.FC<PayPalPaymentProps> = ({ amount, currency, onSuccess, onError }) => {
  const dispatch = useAppDispatch();
  const [isProcessing, setIsProcessing] = useState(false);
  const [{ isPending }] = usePayPalScriptReducer();

  const createOrder = async (data: any, actions: any) => {
    try {
      setIsProcessing(true);
      
      // Create PayPal order using Redux action
      const response = await dispatch(createPayPalOrder({ amount, currency }));
      
      if (createPayPalOrder.fulfilled.match(response)) {
        const { orderId } = response.payload;
        return orderId; // PayPal order ID from backend
      } else {
        throw new Error('Failed to create PayPal order');
      }
    } catch (error) {
      console.error('Error creating PayPal order:', error);
      onError?.(error instanceof Error ? error.message : 'Failed to create payment order');
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const onApprove = async (data: any, actions: any) => {
    try {
      setIsProcessing(true);
      
      // Capture the payment using Redux action
      const response = await dispatch(capturePayPalOrder({ orderId: data.orderID }));
      
      if (capturePayPalOrder.fulfilled.match(response)) {
        const { paymentId } = response.payload;
        onSuccess?.(paymentId);
        console.log('PayPal payment completed:', response.payload);
      } else {
        throw new Error('Payment was not completed');
      }
    } catch (error) {
      console.error('Error capturing PayPal payment:', error);
      onError?.(error instanceof Error ? error.message : 'Failed to capture payment');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayPalError = (err: any) => {
    console.error('PayPal error:', err);
    onError?.(err.message || 'An error occurred with PayPal');
  };

  if (isPending) {
    return (
      <div className="d-flex justify-content-center align-items-center p-3">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading PayPal...</span>
        </div>
        <span className="ms-2">Loading PayPal...</span>
      </div>
    );
  }

  return (
    <div className="paypal-payment-container">
      <PayPalButtons
        createOrder={createOrder}
        onApprove={onApprove}
        onError={handlePayPalError}
        style={{
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'paypal'
        }}
        disabled={isProcessing}
      />
      {isProcessing && (
        <div className="d-flex justify-content-center align-items-center p-2">
          <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
            <span className="visually-hidden">Processing...</span>
          </div>
          <span>Processing payment...</span>
        </div>
      )}
    </div>
  );
};

const PayPalPayment: React.FC<PayPalPaymentProps> = (props) => {
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  if (!paypalClientId) {
    return (
      <div className="alert alert-warning">
        PayPal is not configured. Please add NEXT_PUBLIC_PAYPAL_CLIENT_ID to your environment variables.
      </div>
    );
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId: paypalClientId,
        currency: props.currency,
        intent: 'capture'
      }}
    >
      <PayPalButtonWrapper {...props} />
    </PayPalScriptProvider>
  );
};

export default PayPalPayment;
