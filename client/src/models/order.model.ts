export interface IOrder {
  id: string;
  paymentId: string;
  createdAt: string;
  updatedAt: string;
  items: IOrderItem[]; // Include order items
}

export interface IOrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
}