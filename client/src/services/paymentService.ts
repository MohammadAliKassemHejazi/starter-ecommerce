// services/cartService.ts
import { CartItem } from '@/models/cart.model';
import httpClient from "@/utils/httpClient"



// Load cart from the backend
export const loadCart = async (): Promise<CartItem[]> => {
  const { data: response } = await httpClient.get(`/cart/get`);
  console.log(response);
  return response.cartItems;
};

// Add/update item in the cart
export const addToCart = async (productId: string, quantity: number, price: number) => {
  const { data: response } = await httpClient.post('/cart/update', {  productId, quantity, price });
  return response;
};

// Decrease item quantity in the cart
export const decreaseCart = async (productId: string, quantity: number) => {
  const { data: response } = await httpClient.put('/cart/decrease', {  productId, quantity });
  return response;
};

// Remove item from the cart
export const removeFromCart = async ( productId: string) => {
  const { data: response } = await httpClient.delete(`/cart/delete/${productId}`);
  return response;
};

// Clear the cart
export const clearCart = async () => {
  const { data: response } = await httpClient.delete(`/cart/delete`);
  return response;
};