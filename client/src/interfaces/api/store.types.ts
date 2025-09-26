import { ApiResponse, PaginatedApiResponse } from './apiResponse.types';

// Store API Response Types
export interface StoreResponse extends ApiResponse<{
  id: string;
  name: string;
  description?: string;
  imgUrl: string;
  categoryId: string;
  userId: string;
  isActive: boolean;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
  User?: {
    id: string;
    name: string;
    email: string;
  };
  Category?: {
    id: string;
    name: string;
  };
}> {}

export interface StoresListResponse extends PaginatedApiResponse<{
  id: string;
  name: string;
  description?: string;
  imgUrl: string;
  categoryId: string;
  userId: string;
  isActive: boolean;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
  User?: {
    id: string;
    name: string;
    email: string;
  };
  Category?: {
    id: string;
    name: string;
  };
}> {}

export interface CreateStoreResponse extends ApiResponse<{
  id: string;
  name: string;
  description?: string;
  imgUrl: string;
  categoryId: string;
  userId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}> {}

export interface UpdateStoreResponse extends ApiResponse<{
  id: string;
  name: string;
  description?: string;
  imgUrl: string;
  categoryId: string;
  userId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}> {}

export interface DeleteStoreResponse extends ApiResponse<{
  message: string;
}> {}
