import { ApiResponse, PaginatedApiResponse } from './apiResponse.types';
import { ISubscription } from './auth.types';

// User entity shape
export interface IUser {
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
  createdBy?: {
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
  subscription?: ISubscription;
}

// User API Response Types
export interface UserResponse extends ApiResponse<IUser> {}

export interface UsersListResponse extends PaginatedApiResponse<Omit<IUser, 'permissions'> & {
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
