import { ApiResponse } from './apiResponse.types';

// Cart API Response Types
export interface CartResponse extends ApiResponse<{
  id: string;
  userId: string;
  cartItems: Array<{
    id: string;
    productId: string;
    quantity: number;
    price: number;
    sizeId?: string;
    size?: string;
    Product: {
      id: string;
      name: string;
      description: string;
      price: number;
      originalPrice: number;
      discount: number;
      stockQuantity: number;
      ProductImages?: Array<{
        id: string;
        url: string;
        alt?: string;
      }>;
      Store?: {
        id: string;
        name: string;
      };
    };
  }>;
  totalItems: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}> {}

export interface AddToCartResponse extends ApiResponse<{
  id: string;
  productId: string;
  quantity: number;
  price: number;
  sizeId?: string;
  message: string;
}> {}

export interface UpdateCartResponse extends ApiResponse<{
  id: string;
  productId: string;
  quantity: number;
  price: number;
  sizeId?: string;
  message: string;
}> {}

export interface RemoveFromCartResponse extends ApiResponse<{
  message: string;
  removedItem: {
    productId: string;
    sizeId?: string;
  };
}> {}

export interface ClearCartResponse extends ApiResponse<{
  message: string;
  clearedItems: number;
}> {}
