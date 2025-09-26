// services/cartService.ts
import { CartItem } from '@/models/cart.model';
import httpClient from "@/utils/httpClient"
import { 
	CartResponse, 
	AddToCartResponse, 
	UpdateCartResponse, 
	RemoveFromCartResponse, 
	ClearCartResponse 
} from "@/interfaces/api/cart.types";

// Load cart from the backend
export const loadCart = async (): Promise<CartResponse> => {
  const { data: response } = await httpClient.get<CartResponse>(`/cart/get`);
  console.log(response);
  return response;
};

// Add/update item in the cart
export const addToCart = async (productId: string, quantity: number, price: number, sizeId: string): Promise<AddToCartResponse> => {
  const { data: response } = await httpClient.post<AddToCartResponse>('/cart/update', {  productId, quantity, price ,sizeId});
  return response;
};

// Decrease item quantity in the cart
export const decreaseCart = async (productId: string, quantity: number, sizeId: string): Promise<UpdateCartResponse> => {
  const { data: response } = await httpClient.put<UpdateCartResponse>('/cart/decrease', {  productId, quantity,sizeId });
  return response;
};

// Remove item from the cart
export const removeFromCart = async ( productId: string, sizeId: string): Promise<RemoveFromCartResponse> => {
  const { data: response } = await httpClient.delete<RemoveFromCartResponse>(`/cart/delete/${productId}/${sizeId}`);
  return response;
};

// Clear the cart
export const clearCart = async (): Promise<ClearCartResponse> => {
  const { data: response } = await httpClient.delete<ClearCartResponse>(`/cart/delete`);
  return response;
};