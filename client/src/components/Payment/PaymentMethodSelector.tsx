import React, { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CheckoutForm } from '../../../pages/payment/checkoutwithstripe';
import PayPalPayment from './PayPalPayment';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_Stripe_Key ?? "");

interface PaymentMethodSelectorProps {
  amount: number;
  currency: string;
  package?: any;
  onSuccess?: (paymentId: string, method: string) => void;
  onError?: (error: string) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  amount,
  currency,
  package: pkg,
  onSuccess,
  onError
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'stripe' | 'paypal'>('stripe');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStripeSuccess = (paymentId: string) => {
    onSuccess?.(paymentId, 'stripe');
  };

  const handlePayPalSuccess = (paymentId: string) => {
    onSuccess?.(paymentId, 'paypal');
  };

  const handleError = (error: string) => {
    onError?.(error);
  };

  return (
    <div className="payment-method-selector">
      <div className="mb-4">
        <h4 className="mb-3">Choose Payment Method</h4>
        
        {/* Payment Method Selection */}
        <div className="row g-3">
          <div className="col-md-6">
            <div 
              className={`card payment-method-card ${selectedMethod === 'stripe' ? 'border-primary' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={() => setSelectedMethod('stripe')}
            >
              <div className="card-body text-center">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="stripe"
                    checked={selectedMethod === 'stripe'}
                    onChange={() => setSelectedMethod('stripe')}
                  />
                  <label className="form-check-label w-100" htmlFor="stripe">
                    <i className="bi bi-credit-card fs-1 text-primary mb-2"></i>
                    <h5 className="card-title">Credit/Debit Card</h5>
                    <p className="card-text text-muted">Pay with Visa, Mastercard, or American Express</p>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-md-6">
            <div 
              className={`card payment-method-card ${selectedMethod === 'paypal' ? 'border-primary' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={() => setSelectedMethod('paypal')}
            >
              <div className="card-body text-center">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="paypal"
                    checked={selectedMethod === 'paypal'}
                    onChange={() => setSelectedMethod('paypal')}
                  />
                  <label className="form-check-label w-100" htmlFor="paypal">
                    <i className="bi bi-paypal fs-1 text-primary mb-2"></i>
                    <h5 className="card-title">PayPal</h5>
                    <p className="card-text text-muted">Pay with your PayPal account</p>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Form */}
      <div className="payment-form-container">
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">
              {selectedMethod === 'stripe' ? 'Credit/Debit Card Payment' : 'PayPal Payment'}
            </h5>
          </div>
          <div className="card-body">
            {selectedMethod === 'stripe' ? (
              <Elements stripe={stripePromise}>
                <CheckoutForm 
                  amount={amount}
                  currency={currency}
                  // Only pass packageId and type if pkg exists
                  packageId={pkg?.id}
                  type={pkg ? 'package' : 'cart'}
                  onSuccess={handleStripeSuccess}
                  onError={handleError}
                />
              </Elements>
            ) : (
              <PayPalPayment
                amount={amount}
                currency={currency}
                onSuccess={handlePayPalSuccess}
                onError={handleError}
              />
            )}
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="mt-4">
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">Order Summary</h5>
          </div>
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <span>Total Amount:</span>
              <strong>${amount} {currency.toUpperCase()}</strong>
            </div>
            <div className="d-flex justify-content-between">
              <span>Payment Method:</span>
              <span className="text-capitalize">{selectedMethod}</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .payment-method-card {
          transition: all 0.3s ease;
          border: 2px solid var(--bs-border-color);
        }
        
        .payment-method-card:hover {
          border-color: var(--bs-primary);
          box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
        }
        
        .payment-method-card.border-primary {
          border-color: var(--bs-primary) !important;
          box-shadow: 0 0 0 0.2rem color-mix(in srgb, var(--bs-primary) 25%, transparent);
        }
        
        .form-check-input:checked {
          background-color: var(--bs-primary);
          border-color: var(--bs-primary);
        }
      `}</style>
    </div>
  );
};

export default PaymentMethodSelector;
