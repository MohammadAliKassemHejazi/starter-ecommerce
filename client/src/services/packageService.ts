import httpClient from "@/utils/httpClient";
import { 
	PackagesListResponse, 
	UserPackageResponse, 
	PackageLimitsResponse, 
	AssignPackageResponse, 
	CreatePackageResponse, 
	UpdatePackageResponse, 
	DeletePackageResponse 
} from "@/interfaces/api/package.types";

export interface IPackage {
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
}

export interface IUserPackage {
  id: string;
  userId: string;
  packageId: string;
  startDate: string;
  endDate: string | null;
  isActive: boolean;
  createdById: string | null;
  Package: IPackage;
}

export interface IPackageLimits {
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
}

// Get all available packages
export const getAllPackages = async (): Promise<PackagesListResponse> => {
  const { data: response } = await httpClient.get<PackagesListResponse>("/packages");
  return response;
};

// Get user's active package
export const getUserActivePackage = async (): Promise<UserPackageResponse> => {
  const { data: response } = await httpClient.get<UserPackageResponse>("/packages/user/active");
  return response;
};

// Get user's package limits
export const getUserPackageLimits = async (): Promise<PackageLimitsResponse> => {
  const { data: response } = await httpClient.get<PackageLimitsResponse>("/packages/user/limits");
  return response;
};

// Assign package to user (super admin only)
export const assignPackageToUser = async (userId: string, packageId: string): Promise<AssignPackageResponse> => {
  const { data: response } = await httpClient.post<AssignPackageResponse>("/packages/assign", {
    userId,
    packageId
  });
  return response;
};

// Create new package (super admin only)
export const createPackage = async (packageData: Omit<IPackage, 'id'>): Promise<CreatePackageResponse> => {
  const { data: response } = await httpClient.post<CreatePackageResponse>("/packages", packageData);
  return response;
};

// Update package (super admin only)
export const updatePackage = async (id: string, packageData: Partial<IPackage>): Promise<UpdatePackageResponse> => {
  const { data: response } = await httpClient.patch<UpdatePackageResponse>(`/packages/${id}`, packageData);
  return response;
};

// Delete package (super admin only)
export const deletePackage = async (id: string): Promise<DeletePackageResponse> => {
  const { data: response } = await httpClient.delete<DeletePackageResponse>(`/packages/${id}`);
  return response;
};


