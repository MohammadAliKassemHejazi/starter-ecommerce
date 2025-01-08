// services/cartService.ts
import axios from 'axios';
import { CartItem } from '@/models/cart.model';

const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // Your API base URL
});

// Fetch the user's cart
export const fetchCart = async (userId: string) => {
  const { data: response } = await httpClient.get(`/cart/${userId}`);
  return response.cartItems;
};

// Add/update item in the cart
export const addToCart = async (userId: string, productId: string, quantity: number, price: number) => {
  const { data: response } = await httpClient.post('/cart', { userId, productId, quantity, price });
  return response;
};

// Decrease item quantity in the cart
export const decreaseCart = async (userId: string, productId: string, quantity: number) => {
  const { data: response } = await httpClient.put('/cart', { userId, productId, quantity });
  return response;
};

// Remove item from the cart
export const removeFromCart = async (userId: string, productId: string) => {
  const { data: response } = await httpClient.delete(`/cart/${userId}/${productId}`);
  return response;
};

// Clear the cart
export const clearCart = async (userId: string) => {
  const { data: response } = await httpClient.delete(`/cart/${userId}`);
  return response;
};