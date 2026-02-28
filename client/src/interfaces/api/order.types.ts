import { ApiResponse, PaginatedApiResponse } from './apiResponse.types';
import { IOrderModel } from "@/models/order.model";

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
  orderItems: Array<{
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

export interface OrdersListResponse extends ApiResponse<{
  items: IOrderModel[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
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
