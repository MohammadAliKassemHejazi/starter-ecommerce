import { ApiResponse, PaginatedApiResponse } from './apiResponse.types';

// Order entity shapes
export interface IOrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  productName?: string;
  sizeId?: string;
  size?: string;
  product?: {
    id: string;
    name: string;
    description: string;
    price: number;
    productImages?: Array<{
      id: string;
      url: string;
      alt?: string;
    }>;
  };
}

export interface IOrder {
  id: string;
  userId: string;
  storeId: string;
  status: string;
  totalAmount: number;
  shippingAddress: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  items?: IOrderItem[];
  store?: {
    id: string;
    name: string;
  };
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

// Order API Response Types
export interface OrderResponse extends ApiResponse<IOrder> {}

export interface OrdersListResponse extends PaginatedApiResponse<IOrder> {}

export interface OrderItemsResponse extends ApiResponse<{
  orderId: string;
  items: IOrderItem[];
}> {}

export interface CreateOrderResponse extends ApiResponse<IOrder> {}
export interface UpdateOrderResponse extends ApiResponse<IOrder> {}
export interface DeleteOrderResponse extends ApiResponse<{ message: string }> {}
