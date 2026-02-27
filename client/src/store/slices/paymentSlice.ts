import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { paymentService } from '@/services/shopService';

interface PaymentState {
  paymentStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  clientSecret: string | null; // Store clientSecret for Stripe confirmation
  paypalOrderId: string | null; // Store PayPal order ID
  paymentMethod: 'stripe' | 'paypal' | null;
}

const initialState: PaymentState = {
  paymentStatus: 'idle',
  error: null,
  clientSecret: null,
  paypalOrderId: null,
  paymentMethod: null,
};

// Thunk to create a Stripe payment
export const createPayment = createAsyncThunk<
  { clientSecret: string }, // Return type
  { amount: number; currency: string; paymentMethodId: string }, // Argument type
  { rejectValue: string } // Rejected value type
>(
  'payment/create',
  async ({ amount, currency, paymentMethodId }, { rejectWithValue }) => {
    try {
      const response = await paymentService.createPayment({ amount, currency, paymentMethodId });
      return { clientSecret: response.data.clientSecret! }; // Return clientSecret
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || 'Failed to process payment');
      }
      return rejectWithValue('Failed to process payment');
    }
  }
);

// Thunk to create a PayPal order
export const createPayPalOrder = createAsyncThunk<
  { orderId: string; approvalUrl: string }, // Return type
  { amount: number; currency: string }, // Argument type
  { rejectValue: string } // Rejected value type
>(
  'payment/createPayPalOrder',
  async ({ amount, currency }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, currency }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create PayPal order');
      }

      return {
        orderId: data.data.orderId,
        approvalUrl: data.data.approvalUrl
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || 'Failed to create PayPal order');
      }
      return rejectWithValue('Failed to create PayPal order');
    }
  }
);

// Thunk to capture a PayPal order
export const capturePayPalOrder = createAsyncThunk<
  { orderId: string; status: string; paymentId: string }, // Return type
  { orderId: string }, // Argument type
  { rejectValue: string } // Rejected value type
>(
  'payment/capturePayPalOrder',
  async ({ orderId }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to capture PayPal order');
      }

      return {
        orderId: data.data.orderId,
        status: data.data.status,
        paymentId: data.data.paymentId
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || 'Failed to capture PayPal order');
      }
      return rejectWithValue('Failed to capture PayPal order');
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Stripe payment reducers
      .addCase(createPayment.pending, (state) => {
        state.paymentStatus = 'loading';
        state.paymentMethod = 'stripe';
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.paymentStatus = 'succeeded';
        state.clientSecret = action.payload.clientSecret;
        state.error = null;
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.paymentStatus = 'failed';
        state.error = action.payload as string;
      })
      // PayPal order creation reducers
      .addCase(createPayPalOrder.pending, (state) => {
        state.paymentStatus = 'loading';
        state.paymentMethod = 'paypal';
      })
      .addCase(createPayPalOrder.fulfilled, (state, action) => {
        state.paymentStatus = 'succeeded';
        state.paypalOrderId = action.payload.orderId;
        state.error = null;
      })
      .addCase(createPayPalOrder.rejected, (state, action) => {
        state.paymentStatus = 'failed';
        state.error = action.payload as string;
      })
      // PayPal order capture reducers
      .addCase(capturePayPalOrder.pending, (state) => {
        state.paymentStatus = 'loading';
      })
      .addCase(capturePayPalOrder.fulfilled, (state, action) => {
        state.paymentStatus = 'succeeded';
        state.error = null;
      })
      .addCase(capturePayPalOrder.rejected, (state, action) => {
        state.paymentStatus = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const PaymentSelector = (store: RootState): PaymentState => store.payment;
export default paymentSlice.reducer;