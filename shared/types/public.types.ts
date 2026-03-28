import { ApiResponse, PaginatedApiResponse } from './apiResponse.types';

// Public store shape (subset of IStore without sensitive fields)
export interface IPublicStore {
  id: string;
  name: string;
  description?: string;
  imgUrl: string;
  categoryId: string;
  isActive: boolean;
  createdAt: string;
  category?: {
    id: string;
    name: string;
  };
}

// Public product shape (subset of IProduct without owner details)
export interface IPublicProduct {
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
}

// Public category shape
export interface IPublicCategory {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  subcategories?: Array<{
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
  }>;
}

// Public API Response Types
export interface PublicStoreResponse extends ApiResponse<IPublicStore> {}
export interface PublicStoresListResponse extends PaginatedApiResponse<IPublicStore> {}

export interface PublicProductResponse extends ApiResponse<IPublicProduct> {}
export interface PublicProductsListResponse extends PaginatedApiResponse<IPublicProduct> {}

export interface PublicCategoryResponse extends ApiResponse<IPublicCategory> {}
export interface PublicCategoriesListResponse extends PaginatedApiResponse<IPublicCategory> {}
