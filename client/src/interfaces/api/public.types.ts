import { ApiResponse, PaginatedApiResponse } from './apiResponse.types';

// Public Store API Response Types (for home page)
export interface PublicStoreResponse extends ApiResponse<{
  id: string;
  name: string;
  description?: string;
  imgUrl: string;
  categoryId: string;
  isActive: boolean;
  createdAt: string;
  Category?: {
    id: string;
    name: string;
  };
}> {}

export interface PublicStoresListResponse extends PaginatedApiResponse<{
  id: string;
  name: string;
  description?: string;
  imgUrl: string;
  categoryId: string;
  isActive: boolean;
  createdAt: string;
  Category?: {
    id: string;
    name: string;
  };
}> {}

// Public Product API Response Types (for home page)
export interface PublicProductResponse extends ApiResponse<{
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  stockQuantity: number;
  isActive: boolean;
  ratings?: number;
  commentsCount?: number;
  createdAt: string;
  updatedAt: string;
  productImages?: Array<{
    id: string;
    url: string;
    alt?: string;
  }>;
  store?: {
    id: string;
    name: string;
  };
  category?: {
    id: string;
    name: string;
  };
  subcategory?: {
    id: string;
    name: string;
  };
}> {}

export interface PublicProductsListResponse extends PaginatedApiResponse<{
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  stockQuantity: number;
  isActive: boolean;
  ratings?: number;
  commentsCount?: number;
  createdAt: string;
  updatedAt: string;
  productImages?: Array<{
    id: string;
    url: string;
    alt?: string;
  }>;
  store?: {
    id: string;
    name: string;
  };
  category?: {
    id: string;
    name: string;
  };
  subcategory?: {
    id: string;
    name: string;
  };
}> {}

// Public Category API Response Types (for navigation)
export interface PublicCategoryResponse extends ApiResponse<{
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  Subcategories?: Array<{
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
  }>;
}> {}

export interface PublicCategoriesListResponse extends PaginatedApiResponse<{
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  Subcategories?: Array<{
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
  }>;
}> {}
