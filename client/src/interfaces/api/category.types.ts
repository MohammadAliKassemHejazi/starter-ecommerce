import { ApiResponse, PaginatedApiResponse } from './apiResponse.types';

// Category API Response Types
export interface CategoryResponse extends ApiResponse<{
  id: string;
  name: string;
  description?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}> {}

export interface CategoriesListResponse extends PaginatedApiResponse<{
  id: string;
  name: string;
  description?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}> {}

export interface CreateCategoryResponse extends ApiResponse<{
  id: string;
  name: string;
  description?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}> {}

export interface UpdateCategoryResponse extends ApiResponse<{
  id: string;
  name: string;
  description?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}> {}

export interface DeleteCategoryResponse extends ApiResponse<{
  message: string;
}> {}
