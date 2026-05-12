import { ApiResponse, PaginatedApiResponse } from './apiResponse.types';

// Store entity shape
export interface IStore {
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
  user?: {
    id: string;
    name: string;
    email: string;
  };
  category?: {
    id: string;
    name: string;
  };
}

// Store API Response Types
export interface StoreResponse extends ApiResponse<IStore> {}

export interface StoresListResponse extends PaginatedApiResponse<IStore> {}

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
