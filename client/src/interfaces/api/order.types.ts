import { ApiResponse, PaginatedApiResponse } from './apiResponse.types';
import { IOrderModel } from "@/models/order.model";

// Order API Response Types
export interface OrderResponse extends ApiResponse<IOrderModel> {}

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

export interface CreateOrderResponse extends ApiResponse<IOrderModel> {}
export interface UpdateOrderResponse extends ApiResponse<IOrderModel> {}
export interface DeleteOrderResponse extends ApiResponse<{ message: string; }> {}
