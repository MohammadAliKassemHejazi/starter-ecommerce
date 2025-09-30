import { CartItem } from '@/models/cart.model';
import { ApiResponse } from './apiResponse.types';

// Cart API Response Types
export interface CartResponse extends ApiResponse<{
  id: string;
  userId: string;
  cartItems: CartItem[];
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
