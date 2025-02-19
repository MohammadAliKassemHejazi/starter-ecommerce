import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as vendorService from '../../services/vendorService';

interface VendorDashboardState {
  salesData: { date: string; totalSales: number }[];
  inventoryAlerts: { id: string; productName: string; quantity: number }[];
  orderStatuses: { id: string; status: string; date: string }[];
  loading: boolean;
  error: string | null;
}

const initialState: VendorDashboardState = {
  salesData: [],
  inventoryAlerts: [],
  orderStatuses: [],
  loading: false,
  error: null,
};

export const fetchSalesData = createAsyncThunk(
  'vendorDashboard/fetchSalesData',
  async (_, thunkAPI) => {
    try {
      const response = await vendorService.getSalesData();
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchInventoryAlerts = createAsyncThunk(
  'vendorDashboard/fetchInventoryAlerts',
  async (_, thunkAPI) => {
    try {
      const response = await vendorService.getInventoryAlerts();
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchOrderStatuses = createAsyncThunk(
  'vendorDashboard/fetchOrderStatuses',
  async (_, thunkAPI) => {
    try {
      const response = await vendorService.getOrderStatuses();
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const vendorDashboardSlice = createSlice({
  name: 'vendorDashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Sales Data
    builder.addCase(fetchSalesData.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchSalesData.fulfilled, (state, action) => {
      state.salesData = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchSalesData.rejected, (state, action) => {
      state.error = action.payload as string;
      state.loading = false;
    });

    // Inventory Alerts
    builder.addCase(fetchInventoryAlerts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchInventoryAlerts.fulfilled, (state, action) => {
      state.inventoryAlerts = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchInventoryAlerts.rejected, (state, action) => {
      state.error = action.payload as string;
      state.loading = false;
    });

    // Order Statuses
    builder.addCase(fetchOrderStatuses.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchOrderStatuses.fulfilled, (state, action) => {
      state.orderStatuses = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchOrderStatuses.rejected, (state, action) => {
      state.error = action.payload as string;
      state.loading = false;
    });
  },
});

export default vendorDashboardSlice.reducer;

// Selectors
export const selectSalesData = (state: any) => state.vendorDashboard.salesData;
export const selectInventoryAlerts = (state: any) =>
  state.vendorDashboard.inventoryAlerts;
export const selectOrderStatuses = (state: any) =>
  state.vendorDashboard.orderStatuses;
export const selectLoading = (state: any) => state.vendorDashboard.loading;
export const selectError = (state: any) => state.vendorDashboard.error;