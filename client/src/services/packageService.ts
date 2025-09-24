import httpClient from "@/utils/httpClient";

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
export const getAllPackages = async (): Promise<IPackage[]> => {
  const { data: response } = await httpClient.get("/packages");
  return response;
};

// Get user's active package
export const getUserActivePackage = async (): Promise<IUserPackage | null> => {
  const { data: response } = await httpClient.get("/packages/user/active");
  return response;
};

// Get user's package limits
export const getUserPackageLimits = async (): Promise<IPackageLimits> => {
  const { data: response } = await httpClient.get("/packages/user/limits");
  return response;
};

// Assign package to user (super admin only)
export const assignPackageToUser = async (userId: string, packageId: string): Promise<IUserPackage> => {
  const { data: response } = await httpClient.post("/packages/assign", {
    userId,
    packageId
  });
  return response;
};

// Create new package (super admin only)
export const createPackage = async (packageData: Omit<IPackage, 'id'>): Promise<IPackage> => {
  const { data: response } = await httpClient.post("/packages", packageData);
  return response;
};

// Update package (super admin only)
export const updatePackage = async (id: string, packageData: Partial<IPackage>): Promise<IPackage> => {
  const { data: response } = await httpClient.patch(`/packages/${id}`, packageData);
  return response;
};

// Delete package (super admin only)
export const deletePackage = async (id: string): Promise<void> => {
  await httpClient.delete(`/packages/${id}`);
};
