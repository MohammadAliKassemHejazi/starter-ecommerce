import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as orderService from "@/services/orderService";
import { RootState } from "../store";
import { IOrder } from "@/models/order.model";



interface OrderState {
  orders: IOrder[];
  lastOrder: IOrder | null;
  loading: boolean;
  error: string;
}

const initialState: OrderState = {
  orders: [],
  lastOrder: null,
  loading: false,
  error: "",
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
  reducers: {},
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
        console.log(action)
        state.orders = action.payload;
      })
      .addCase(fetchOrdersByDate.rejected, (state) => {
          
        state.error = "Failed to fetch orders by date";
      })
      .addCase(fetchOrderItems.fulfilled, (state, action) => {
        const order = state.orders.find((o) => o.id === action.payload.orderId);
        if (order) {
          order.items = action.payload.items;
        }
      });
  },
});

export const ordersSelector = (state: RootState): IOrder[] => state.order.orders;
export const lastOrderSelector = (state: RootState): IOrder | null => state.order.lastOrder;
export const loadingSelector = (state: RootState): boolean => state.order.loading;

export default orderSlice.reducer;