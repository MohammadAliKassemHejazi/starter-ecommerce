import { ApiResponse } from './apiResponse.types';

// Shared subscription shape
export interface ISubscription {
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
}

// Authenticated user data shape — shared between server services and client
export interface IAuthUser {
  id: string;
  email: string;
  name: string;
  address: string;
  phone: string;
  bio?: string;
  accessToken?: string;
  roles: Array<{ id: string; name: string }>;
  permissions: Array<{ id: string; name: string }>;
  subscription?: ISubscription;
}

// Auth API Response Types
export interface SignInResponse extends ApiResponse<IAuthUser> {}

export interface SignUpResponse extends ApiResponse<{
  id: string;
  email: string;
  name: string;
  address: string;
  phone: string;
}> {}

export interface SessionResponse extends ApiResponse<IAuthUser> {}

export interface UserSessionsResponse extends ApiResponse<Array<{
  id: string;
  userId: string;
  deviceInfo: string;
  ipAddress: string;
  userAgent: string;
  isActive: boolean;
  createdAt: string;
  lastActivity: string;
}>> {}

export interface LogoutResponse extends ApiResponse<{
  message: string;
}> {}
