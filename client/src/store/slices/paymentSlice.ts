import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store"; // Import RootState if it's already defined
import { paymentService } from "@/services/shopService";


// Define the PaymentState interface
interface PaymentState {
  paymentStatus: 'idle' | 'loading' | 'succeeded' | 'failed'; // Can be one of these states
  error: string | null; // Error can be a string or null
}

// Define the initial state with the PaymentState type
const initialState: PaymentState = {
  paymentStatus: 'idle', // Default status is idle
  error: null, // No error initially
};

export const createPayment = createAsyncThunk<
  string, // Return type (response from the backend)
  { amount: number; currency: string; paymentMethodId: string }, // Argument type
  { rejectValue: string } // Rejected value type
>(
  'payment/create',
  async ({ amount, currency, paymentMethodId }, { rejectWithValue }) => {
    try {
      const response = await paymentService.createPayment({ amount, currency, paymentMethodId });
      return response; // Return the response from the backend
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || 'Failed to process payment');
      }
      return rejectWithValue('Failed to process payment');
    }
  }
);

// Create the paymentSlice
const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPayment.pending, (state) => {
        state.paymentStatus = 'loading'; // Set status to loading
      })
      .addCase(createPayment.fulfilled, (state) => {
        state.paymentStatus = 'succeeded'; // Set status to succeeded
        state.error = null; // Clear any previous errors
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.paymentStatus = 'failed'; // Set status to failed
        state.error = action.payload as string; // Set the error message
      });
  },
});
export const PaymentSelector = (store: RootState): string | undefined => store.payment.paymentStatus;
export default paymentSlice.reducer;
