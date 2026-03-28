// Package Request Body Types

export interface CreatePackageRequest {
  name: string;
  description: string;
  storeLimit: number;
  categoryLimit: number;
  productLimit: number;
  userLimit: number;
  isSuperAdminPackage?: boolean;
  price: number;
  isActive?: boolean;
}

export interface UpdatePackageRequest {
  name?: string;
  description?: string;
  storeLimit?: number;
  categoryLimit?: number;
  productLimit?: number;
  userLimit?: number;
  isSuperAdminPackage?: boolean;
  price?: number;
  isActive?: boolean;
}

export interface AssignPackageRequest {
  userId: string;
  packageId: string;
  endDate?: string | null;
}

export interface ActivatePackageRequest {
  packageId: string;
}
