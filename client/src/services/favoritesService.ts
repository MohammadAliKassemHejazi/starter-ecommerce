import httpClient from '@/utils/httpClient';

export interface FavoriteProduct {
  id: string;
  name: string;
  price: number;
  description?: string;
  images: Array<{ imageUrl: string }>;
}

export interface Favorite {
  id: string;
  productId: string;
  userId: string;
  product: FavoriteProduct;
  createdAt: string;
  updatedAt: string;
}

export interface FavoritesResponse {
  success: boolean;
  data: Favorite[];
  message?: string;
}

export interface AddToFavoritesResponse {
  success: boolean;
  data: Favorite;
  message?: string;
}

// Get user's favorites
export const getFavorites = async (): Promise<FavoritesResponse> => {
  const response = await httpClient.get('/favorites');
  return response.data;
};

// Add product to favorites
export const addToFavorites = async (productId: string): Promise<AddToFavoritesResponse> => {
  const response = await httpClient.post('/favorites', { productId });
  return response.data;
};

// Remove product from favorites
export const removeFromFavorites = async (productId: string): Promise<{ success: boolean; message?: string }> => {
  const response = await httpClient.delete(`/favorites/${productId}`);
  return response.data;
};

// Check if product is in favorites
export const isProductInFavorites = async (productId: string): Promise<boolean> => {
  try {
    const favorites = await getFavorites();
    return favorites.data.some(fav => fav.productId === productId);
  } catch (error) {
    console.error('Error checking favorites:', error);
    return false;
  }
};
