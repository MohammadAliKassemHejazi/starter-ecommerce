import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import * as analyticsService from '../../services/analyticsService';

interface AnalyticsEvent {
  id: string;
  eventType: string;
  eventData: any;
  userId: string;
  createdAt: string;
  User?: {
    id: string;
    name: string;
    email: string;
  };
}

interface AnalyticsStats {
  eventType: string;
  count: number;
}

interface AnalyticsState {
  events: AnalyticsEvent[];
  stats: AnalyticsStats[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  filters: {
    eventType: string;
    startDate: string;
    endDate: string;
  };
}

const initialState: AnalyticsState = {
  events: [],
  stats: [],
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
  loading: false,
  error: null,
  filters: {
    eventType: '',
    startDate: '',
    endDate: ''
  }
};

export const fetchAnalytics = createAsyncThunk(
  'analytics/fetchAnalytics',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await analyticsService.getAnalytics(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch analytics');
    }
  }
);

export const fetchAnalyticsStats = createAsyncThunk(
  'analytics/fetchStats',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await analyticsService.getAnalyticsStats(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
    }
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.page = 1; // Reset to first page when filters change
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.page = 1;
    }
  },
  extraReducers: (builder) => {
    // Fetch Analytics
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload.data || {};
        state.events = data.items || [];
        state.total = data.total || 0;
        state.totalPages = data.totalPages || 0;
        state.page = data.page || 1;
        state.limit = data.limit || 10;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Stats
    builder
      .addCase(fetchAnalyticsStats.pending, (state) => {
        // We don't necessarily want to show global loading for stats, or we can handle it separately
      })
      .addCase(fetchAnalyticsStats.fulfilled, (state, action) => {
        state.stats = action.payload.data || [];
      })
      .addCase(fetchAnalyticsStats.rejected, (state, action) => {
        console.error('Failed to fetch stats:', action.payload);
      });
  }
});

export const { setFilters, setPage, clearFilters } = analyticsSlice.actions;

export const selectAnalyticsEvents = (state: RootState) => state.analytics.events;
export const selectAnalyticsStats = (state: RootState) => state.analytics.stats;
export const selectAnalyticsLoading = (state: RootState) => state.analytics.loading;
export const selectAnalyticsError = (state: RootState) => state.analytics.error;
export const selectAnalyticsFilters = (state: RootState) => state.analytics.filters;
export const selectAnalyticsPagination = (state: RootState) => ({
  page: state.analytics.page,
  limit: state.analytics.limit,
  total: state.analytics.total,
  totalPages: state.analytics.totalPages
});

export default analyticsSlice.reducer;
