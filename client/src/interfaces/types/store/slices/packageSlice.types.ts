// Package API Response Types
export interface Package {
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
}