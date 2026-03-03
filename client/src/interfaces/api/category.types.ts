import { ApiResponse, PaginatedApiResponse } from './apiResponse.types';

// Category API Response Types
export interface CategoryResponse extends ApiResponse<{
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdById?: string;
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
  subcategories?: Array<{
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
  }>;
}> {}

export interface CategoriesListResponse extends PaginatedApiResponse<{
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdById?: string;
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
  subcategories?: Array<{
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
  }>;
}> {}

export interface CreateCategoryResponse extends ApiResponse<{
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdById?: string;
}> {}

export interface UpdateCategoryResponse extends ApiResponse<{
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdById?: string;
}> {}

export interface DeleteCategoryResponse extends ApiResponse<{
  message: string;
}> {}
