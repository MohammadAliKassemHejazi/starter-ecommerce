import { ApiResponse } from './apiResponse.types';
import { IProduct } from './product.types';

// Cart item entity shape (extends product with cart-specific fields)
export interface ICartItem extends IProduct {
  cartItemId: string;
  quantity: number;
  sizeId?: string;
  size?: {
    id: string;
    size: string;
  };
}

// Cart entity shape
export interface ICart {
  id: string;
  userId: string;
  cartItems: ICartItem[];
  totalItems: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

// Cart API Response Types
export interface CartResponse extends ApiResponse<ICart> {}

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
