import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { paymentService } from '@/services/shopService';

interface PaymentState {
  paymentStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  clientSecret: string | null; // Store clientSecret for Stripe confirmation
}

const initialState: PaymentState = {
  paymentStatus: 'idle',
  error: null,
  clientSecret: null,
};

// Thunk to create a payment
export const createPayment = createAsyncThunk<
  { clientSecret: string }, // Return type
  { amount: number; currency: string; paymentMethodId: string }, // Argument type
  { rejectValue: string } // Rejected value type
>(
  'payment/create',
  async ({ amount, currency, paymentMethodId }, { rejectWithValue }) => {
    try {
      const response = await paymentService.createPayment({ amount, currency, paymentMethodId });
      return { clientSecret: response.body.clientSecret }; // Return clientSecret
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || 'Failed to process payment');
      }
      return rejectWithValue('Failed to process payment');
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPayment.pending, (state) => {
        state.paymentStatus = 'loading';
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.paymentStatus = 'succeeded';
        state.clientSecret = action.payload.clientSecret; // Store clientSecret
        state.error = null;
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.paymentStatus = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const PaymentSelector = (store: RootState): PaymentState => store.payment;
export default paymentSlice.reducer;