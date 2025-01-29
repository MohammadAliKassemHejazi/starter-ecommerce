export interface IOrder {
  id: string;

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

export interface IOrderModel {
  id: string;
  paymentId: string;
  customerName: string;
  totalPrice: number;
  status: string; // e.g., "Pending", "Completed", "Cancelled"
  createdAt: string; // ISO string for date-time
  updatedAt: string; // ISO string for date-time
  items?: IOrderItem[]; // Optional: list of items in the order
}
