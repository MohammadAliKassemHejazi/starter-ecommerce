import httpClient from "@/utils/httpClient";
import { 
	PublicStoresListResponse, 
	PublicProductsListResponse, 
	PublicCategoriesListResponse 
} from "@/interfaces/api/public.types";
import { ArticlesListResponse } from "@/interfaces/api/article.types";

// Public API endpoints that don't require authentication

// Get all public stores (for home page)
export const getPublicStores = async (): Promise<PublicStoresListResponse> => {
  const { data: response } = await httpClient.get<PublicStoresListResponse>("/public/stores");
  return response;
};

// Get public products listing (for home page)
export const getPublicProducts = async (page: number = 1, pageSize: number = 10): Promise<PublicProductsListResponse> => {
  const { data: response } = await httpClient.get<PublicProductsListResponse>(`/public/products?page=${page}&pageSize=${pageSize}`);
  return response;
};

// Get public categories (for navigation)
export const getPublicCategories = async (): Promise<PublicCategoriesListResponse> => {
  const { data: response } = await httpClient.get<PublicCategoriesListResponse>("/public/categories");
  return response;
};

// Get public product by ID
export const getPublicProductById = async (id: string): Promise<PublicProductsListResponse> => {
  const { data: response } = await httpClient.get<PublicProductsListResponse>(`/public/products/${id}`);
  return response;
};

// Get public products by store
export const getPublicProductsByStore = async (
  storeId: string, 
  page: number = 1, 
  pageSize: number = 10
): Promise<PublicProductsListResponse> => {
  const { data: response } = await httpClient.get<PublicProductsListResponse>(
    `/public/stores/${storeId}/products?page=${page}&pageSize=${pageSize}`
  );
  return response;
};

// Get public store by ID
export const getPublicStoreById = async (id: string): Promise<PublicStoresListResponse> => {
  const { data: response } = await httpClient.get<PublicStoresListResponse>(`/public/stores/${id}`);
  return response;
};

// Get public articles
export const getPublicArticles = async (): Promise<ArticlesListResponse> => {
  const { data: response } = await httpClient.get<ArticlesListResponse>("/public/articles");
  return response;
};
