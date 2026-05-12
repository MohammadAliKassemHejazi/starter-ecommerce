import { ApiResponse, PaginatedApiResponse } from './apiResponse.types';

// SubCategory entity shape
export interface ISubCategory {
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
}

// SubCategory API Response Types
export interface SubCategoryResponse extends ApiResponse<ISubCategory> {}

export interface SubCategoriesListResponse extends PaginatedApiResponse<ISubCategory> {}

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
