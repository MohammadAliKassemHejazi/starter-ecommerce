import httpClient from "@/utils/httpClient";
import { 
	PackagesListResponse, 
	UserPackageResponse, 
	PackageLimitsResponse, 
	AssignPackageResponse, 
	CreatePackageResponse, 
	UpdatePackageResponse, 
	DeletePackageResponse,
	PackageResponse,
	ActivatePackageResponse
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

export interface IPackageProps {
  name: string;
  description?: string;
  storeLimit: number;
  categoryLimit: number;
  productLimit: number;
  userLimit: number;
  isSuperAdminPackage: boolean;
  price: number;
  isActive?: boolean;
}

// Get all available packages
export const requestAllPackages = async (): Promise<PackagesListResponse> => {
  const { data: response } = await httpClient.get<PackagesListResponse>("/packages");
  console.log(response , "all packages");
  return response;
};

// Get package by ID
export const requestPackageById = async (id: string): Promise<PackageResponse> => {
  const { data: response } = await httpClient.get<PackageResponse>(`/packages?id=${id}`);
  return response;
};

// Get user's active package
export const getUserActivePackage = async (): Promise<UserPackageResponse> => {
  const { data: response } = await httpClient.get<UserPackageResponse>("/packages/active");
  return response;
};

// Get user's package limits
export const getUserPackageLimits = async (): Promise<PackageLimitsResponse> => {
  const { data: response } = await httpClient.get<PackageLimitsResponse>("/packages/limits");
  console.log(response , " package limits");
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
export const requestCreatePackage = async (packageData: IPackageProps): Promise<CreatePackageResponse> => {
  const { data: response } = await httpClient.post<CreatePackageResponse>("/packages", packageData);
  return response;
};

// Update package (super admin only)
export const requestUpdatePackage = async (id: string, packageData: IPackageProps): Promise<UpdatePackageResponse> => {
  const { data: response } = await httpClient.patch<UpdatePackageResponse>(`/packages/update/` + id, packageData);
  return response;
};

// Delete package (super admin only)
export const requestDeletePackage = async (id: string): Promise<DeletePackageResponse> => {
  const { data: response } = await httpClient.delete<DeletePackageResponse>(`/packages/${id}`);
  return response;
};

// Activate package for current user
export const requestActivatePackage = async (packageId: string): Promise<ActivatePackageResponse> => {
  const { data: response } = await httpClient.post<ActivatePackageResponse>(`/packages/activate`, { packageId });
  return response;
};


