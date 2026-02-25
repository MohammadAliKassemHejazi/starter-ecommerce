import { ApiResponse, PaginatedApiResponse } from './apiResponse.types';

// User API Response Types
export interface UserResponse extends ApiResponse<{
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  bio?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdById?: string;
  CreatedBy?: {
    id: string;
    name: string;
    email: string;
  };
  roles: Array<{
    id: string;
    name: string;
    description?: string;
  }>;
  permissions: Array<{
    id: string;
    name: string;
    description?: string;
  }>;
  subscription?: {
    packageId: string;
    packageName: string;
    limits: {
      storeLimit: number;
      productLimit: number;
      userLimit: number;
      isSuperAdmin: boolean;
    };
    isActive: boolean;
    endDate: string | null;
  };
}> {}

export interface UsersListResponse extends PaginatedApiResponse<{
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  bio?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdById?: string;
  CreatedBy?: {
    id: string;
    name: string;
    email: string;
  };
  roles: Array<{
    id: string;
    name: string;
    description?: string;
  }>;
  subscription?: {
    packageId: string;
    packageName: string;
    isActive: boolean;
    endDate: string | null;
  };
}> {}

export interface CreateUserResponse extends ApiResponse<{
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  bio?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdById?: string;
}> {}

export interface UpdateUserResponse extends ApiResponse<{
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  bio?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdById?: string;
}> {}

export interface DeleteUserResponse extends ApiResponse<{
  message: string;
}> {}

export interface AssignRoleResponse extends ApiResponse<{
  userId: string;
  roleId: string;
  assignedAt: string;
}> {}

export interface RemoveRoleResponse extends ApiResponse<{
  message: string;
}> {}
