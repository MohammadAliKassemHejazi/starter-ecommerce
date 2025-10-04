import { ApiResponse, PaginatedApiResponse } from './apiResponse.types';

// Package API Response Types
export interface PackageResponse extends ApiResponse<{
  id: string;
  name: string;
  description: string;
  storeLimit: number;
  categoryLimit: number;
  productLimit: number;
  userLimit: number;
  isSuperAdminPackage: boolean;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}> {}

export interface ActivatePackageResponse extends ApiResponse<{
  success: boolean;
  message: string;
}> {}

export interface PackagesListResponse extends PaginatedApiResponse<{
  id: string;
  name: string;
  description: string;
  storeLimit: number;
  categoryLimit: number;
  productLimit: number;
  userLimit: number;
  isSuperAdminPackage: boolean;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}> {}

export interface UserPackageResponse extends ApiResponse<{
  id: string;
  userId: string;
  packageId: string;
  startDate: string;
  endDate: string | null;
  isActive: boolean;
  createdById: string | null;
  Package: {
    id: string;
    name: string;
    description: string;
    storeLimit: number;
    categoryLimit: number;
    productLimit: number;
    userLimit: number;
    isSuperAdminPackage: boolean;
    price: number;
    isActive: boolean;
  };
}> {}

export interface PackageLimitsResponse extends ApiResponse<{
  canCreateStore: boolean;
  canCreateProduct: boolean;
  canCreateUser: boolean;
  isSuperAdmin: boolean;
  currentStoreCount: number;
  currentProductCount: number;
  currentUserCount: number;
  storeLimit: number;
  productLimit: number;
  userLimit: number;
  packageName: string;
  packageId: string;
  isActive: boolean;
  endDate: string | null;
}> {}

export interface CreatePackageResponse extends ApiResponse<{
  id: string;
  name: string;
  description: string;
  storeLimit: number;
  categoryLimit: number;
  productLimit: number;
  userLimit: number;
  isSuperAdminPackage: boolean;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}> {}

export interface UpdatePackageResponse extends ApiResponse<{
  id: string;
  name: string;
  description: string;
  storeLimit: number;
  categoryLimit: number;
  productLimit: number;
  userLimit: number;
  isSuperAdminPackage: boolean;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}> {}

export interface DeletePackageResponse extends ApiResponse<{
  message: string;
}> {}

export interface AssignPackageResponse extends ApiResponse<{
  id: string;
  userId: string;
  packageId: string;
  startDate: string;
  endDate: string | null;
  isActive: boolean;
  createdById: string;
}> {}
