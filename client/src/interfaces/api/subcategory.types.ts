import { ApiResponse, PaginatedApiResponse } from './apiResponse.types';

// Subcategory API Response Types
export interface SubCategoryResponse extends ApiResponse<{
  id: string;
  name: string;
  categoryId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
    description?: string;
  };
}> {}

export interface SubCategoriesListResponse extends PaginatedApiResponse<{
  id: string;
  name: string;
  categoryId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
    description?: string;
  };
}> {}

export interface CreateSubCategoryResponse extends ApiResponse<{
  id: string;
  name: string;
  categoryId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}> {}

export interface UpdateSubCategoryResponse extends ApiResponse<{
  id: string;
  name: string;
  categoryId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}> {}

export interface DeleteSubCategoryResponse extends ApiResponse<{
  message: string;
}> {}
