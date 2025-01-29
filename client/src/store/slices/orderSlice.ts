import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as orderService from "@/services/orderService";
import { RootState } from "../store";
import { IOrderModel } from "@/models/order.model";

interface OrderState {
  orders: IOrderModel[];
  lastOrder: IOrderModel | null;
  loading: boolean;
  error: string;
  currentPage: number;
  pageSize: number;
  totalOrders: number;
  filter: { from?: string; to?: string };
}

const initialState: OrderState = {
  orders: [],
  lastOrder: null,
  loading: false,
  error: "",
  currentPage: 1,
  pageSize: 10,
  totalOrders: 0,
  filter: {},
};

export const fetchLastOrder = createAsyncThunk(
  "orders/fetchLastOrder",
  async () => {
    const response = await orderService.requestLastOrder();
    return response;
  }
);

export const fetchOrdersByDate = createAsyncThunk(
  "orders/fetchByDate",
  async ({ from, to }: { from: string; to: string }) => {
    const response = await orderService.requestOrdersByDate(from, to);
    return response;
  }
);

export const fetchOrdersByStore = createAsyncThunk(
  "orders/fetchByStore",
  async ({ storeId, page, pageSize ,from ,to }: { storeId: string; page: number; pageSize: number , from?: string; to?: string}) => {
    const response = await orderService.requestOrdersByStore(storeId, page, pageSize,from ,to);
    return response;
  }
);

export const fetchOrderItems = createAsyncThunk(
  "orders/fetchItems",
  async (orderId: string) => {
    const response = await orderService.requestOrderItems(orderId);
    return response;
  }
);



export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setPage(state, action) {
      state.currentPage = action.payload;
    },
    setPageSize(state, action) {
      state.pageSize = action.payload;
    },
    setFilter(state, action) {
      state.filter = action.payload;
    },
    clearError(state) {
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLastOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLastOrder.fulfilled, (state, action) => {
        state.lastOrder = action.payload;
        state.loading = false;
      })
      .addCase(fetchLastOrder.rejected, (state) => {
        state.error = "Failed to fetch last order";
        state.loading = false;
      })
      .addCase(fetchOrdersByDate.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(fetchOrdersByDate.rejected, (state) => {
        state.error = "Failed to fetch orders by date";
      })
      .addCase(fetchOrdersByStore.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrdersByStore.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.totalOrders = action.payload.total;
        state.loading = false;
      })
      .addCase(fetchOrdersByStore.rejected, (state) => {
        state.error = "Failed to fetch orders by store";
        state.loading = false;
      })
      .addCase(fetchOrderItems.fulfilled, (state, action) => {
        const order = state.orders.find((o) => o.id === action.payload.orderId);
        if (order) {
          order.items = action.payload.items;
        }
      })

  },
});

export const ordersSelector = (state: RootState): IOrderModel[] => state.order.orders;
export const lastOrderSelector = (state: RootState): IOrderModel | null => state.order.lastOrder;
export const loadingSelector = (state: RootState): boolean => state.order.loading;
export const totalOrdersSelector = (state: RootState): number => state.order.totalOrders;
export const pageSelector = (state: RootState): number => state.order.currentPage;
export const pageSizeSelector = (state: RootState): number => state.order.pageSize;
export const orderByStoreSelector = (state: RootState): IOrderModel[] => state.order.orders;

export const { setPage, setPageSize, setFilter, clearError } = orderSlice.actions;

export default orderSlice.reducer;
