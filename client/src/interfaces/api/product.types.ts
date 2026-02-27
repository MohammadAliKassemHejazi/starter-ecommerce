import { ApiResponse, PaginatedApiResponse } from './apiResponse.types';

// Product API Response Types
export interface ProductResponse extends ApiResponse<{
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  stockQuantity: number;
  isActive: boolean;
  subcategoryId: string;
  categoryId: string;
  storeId: string;
  metaTitle?: string;
  metaDescription?: string;
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
  page: number;
  pageSize: number;
  total: number;
  sizeItems?: Array<{
    id: string;
    size: string;
    sizeId: string;
    quantity: number;
  }>;
}> {}

export interface ProductsListResponse extends PaginatedApiResponse<{
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  stockQuantity: number;
  isActive: boolean;
  subcategoryId: string;
  categoryId: string;
  storeId: string;
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
  page: number;
  pageSize: number;
  total: number;
  sizeItems?: Array<{
    id: string;
    size: string;
    sizeId: string;
    quantity: number;
  }>;
}> {}

export interface CreateProductResponse extends ApiResponse<{
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  stockQuantity: number;
  isActive: boolean;
  subcategoryId: string;
  categoryId: string;
  storeId: string;
  createdAt: string;
  updatedAt: string;
}> {}

export interface UpdateProductResponse extends ApiResponse<{
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  stockQuantity: number;
  isActive: boolean;
  subcategoryId: string;
  categoryId: string;
  storeId: string;
  createdAt: string;
  updatedAt: string;
}> {}

export interface DeleteProductResponse extends ApiResponse<{
  message: string;
}> {}
