import httpClient from "@/utils/httpClient";
import { IOrderModel, IOrderItem } from "@/models/order.model";

interface FetchOrdersByStoreResponse {
  orders: IOrderModel[];
  total: number;
}

export const requestLastOrder = async (): Promise<IOrderModel> => {
  const { data: response } = await httpClient.get("/orders/last");
  return response;
};

export const requestOrdersByDate = async (from: string, to: string): Promise<IOrderModel[]> => {
    const { data: response } = await httpClient.post("/orders/date-range", { from, to });

  return response;
};

export const requestOrdersByStore = async (storeId: string, page: number, pageSize: number, from?: string, to?: string): Promise<FetchOrdersByStoreResponse> => {
    const { data: response } = await httpClient.get(`/api/orders?storeId=${storeId}&page=${page}&pageSize=${pageSize}&from=${from}&to=${to}`);

  return response;
};


export const requestOrderItems = async (orderId: string): Promise<{ orderId: string; items: IOrderItem[] }> => {
  const { data: response } = await httpClient.get(`/orders/${orderId}/items`);
  return response;
};