import httpClient from "@/utils/httpClient";
import { IOrder, IOrderItem } from "@/models/order.model";

export const requestLastOrder = async (): Promise<IOrder> => {
  const { data: response } = await httpClient.get("/orders/last");
  return response;
};

export const requestOrdersByDate = async (from: string, to: string): Promise<IOrder[]> => {
    const { data: response } = await httpClient.post("/orders/date-range", { from, to });

  return response;
};

export const requestOrderItems = async (orderId: string): Promise<{ orderId: string; items: IOrderItem[] }> => {
  const { data: response } = await httpClient.get(`/orders/${orderId}/items`);
  return response;
};