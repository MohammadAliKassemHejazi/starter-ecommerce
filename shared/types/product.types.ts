import { ApiResponse, PaginatedApiResponse } from './apiResponse.types';

// Size shape
export interface ISize {
  id?: string;
  size: string;
}

// Product image shape
export interface IProductImage {
  id: string;
  url: string;
  alt?: string;
}

// Size item shape
export interface ISizeItem {
  id: string;
  size: string;
  sizeId: string;
  quantity: number;
}

// Product entity shape
export interface IProduct {
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
  ownerId: string;
  thumbnail?: string;
  metaTitle?: string;
  metaDescription?: string;
  ratings?: number;
  commentsCount?: number;
  createdAt: string;
  updatedAt: string;
  productImages?: IProductImage[];
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
  sizeItems?: ISizeItem[];
  // Cart interaction fields — set by user when selecting a product to add to cart
  sizeId?: string;
  quantity?: number;
}

// Product API Response Types
export interface ProductResponse extends ApiResponse<IProduct> {}

export interface ProductsListResponse extends PaginatedApiResponse<IProduct> {}

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
  ownerId: string;
  thumbnail?: string;
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
  ownerId: string;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
}> {}

export interface DeleteProductResponse extends ApiResponse<{
  message: string;
}> {}
