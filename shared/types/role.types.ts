import { ApiResponse } from './apiResponse.types';

// Role entity shape
export interface IRole {
  id: string;
  name: string;
  permissions?: IPermission[];
}

export interface IPermission {
  id: string;
  name: string;
}

// Role API Response Types
export interface RoleResponse extends ApiResponse<IRole> {}
export interface RolesListResponse extends ApiResponse<IRole[]> {}
export interface CreateRoleResponse extends ApiResponse<IRole> {}
export interface UpdateRoleResponse extends ApiResponse<IRole> {}
export interface DeleteRoleResponse extends ApiResponse<{ message: string }> {}
