export interface UserModel {
  id: string;
  email: string;
  name: string;
  address?: string;
  phone?: string;
  bio?: string;
  accessToken?: string;
  roles?: Array<{ id: string; name: string }>;
  permissions?: Array<{ id: string; name: string }>;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
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
}
