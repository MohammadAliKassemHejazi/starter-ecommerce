import httpClient from "@/utils/httpClient";
import { IOrderModel, IOrderItem } from "@/models/order.model";
import { 
	OrderResponse, 
	OrdersListResponse, 
	OrderItemsResponse 
} from "@/interfaces/api/order.types";

interface FetchOrdersByStoreResponse {
  orders: IOrderModel[];
  total: number;
}

export const requestLastOrder = async (): Promise<OrderResponse> => {
  const { data: response } = await httpClient.get<OrderResponse>("/admin/orders/last");
  return response;
};

export const requestOrdersByDate = async (from: string, to: string): Promise<OrdersListResponse> => {
    const { data: response } = await httpClient.post<OrdersListResponse>("/admin/orders/date-range", { from, to });
  return response;
};

export const requestOrdersByStore = async (storeId: string, page: number, pageSize: number, from?: string, to?: string): Promise<OrdersListResponse> => {
    const { data: response } = await httpClient.get<OrdersListResponse>(`/orders?storeId=${storeId}&page=${page}&pageSize=${pageSize}&from=${from}&to=${to}`);
  return response;
};

export const requestOrderItems = async (orderId: string): Promise<OrderItemsResponse> => {
  const { data: response } = await httpClient.get<OrderItemsResponse>(`/admin/orders/${orderId}/items`);
  return response;
};