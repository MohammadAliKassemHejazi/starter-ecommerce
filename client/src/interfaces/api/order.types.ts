import { ApiResponse, PaginatedApiResponse } from './apiResponse.types';

// Order API Response Types
export interface OrderResponse extends ApiResponse<{
  id: string;
  paymentId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  totalPrice: number;
  status: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    sizeId?: string;
    size?: string;
  }>;
  shippingDetails?: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}> {}

export interface OrdersListResponse extends PaginatedApiResponse<{
  id: string;
  paymentId: string;
  customerName: string;
  customerEmail: string;
  totalPrice: number;
  status: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
  itemsCount: number;
}> {}

export interface OrderItemsResponse extends ApiResponse<{
  orderId: string;
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    sizeId?: string;
    size?: string;
    Product?: {
      id: string;
      name: string;
      description: string;
      price: number;
      ProductImages?: Array<{
        id: string;
        url: string;
        alt?: string;
      }>;
    };
  }>;
}> {}

export interface CreateOrderResponse extends ApiResponse<{
  id: string;
  paymentId: string;
  customerName: string;
  totalPrice: number;
  status: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
}> {}

export interface UpdateOrderResponse extends ApiResponse<{
  id: string;
  paymentId: string;
  customerName: string;
  totalPrice: number;
  status: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
}> {}

export interface DeleteOrderResponse extends ApiResponse<{
  message: string;
}> {}
