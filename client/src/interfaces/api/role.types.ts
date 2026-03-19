import { ApiResponse, PaginatedApiResponse } from './apiResponse.types';

// Role Domain Model mapping to backend IRoleAttributes
export interface IRoleModel {
  id: string;
  name: string;
  permissions?: IPermissionModel[];
}

export interface IPermissionModel {
  id: string;
  name: string;
}

// Role API Response Types
export interface RoleResponse extends ApiResponse<IRoleModel> {}
export interface RolesListResponse extends ApiResponse<IRoleModel[]> {}
export interface CreateRoleResponse extends ApiResponse<IRoleModel> {}
export interface UpdateRoleResponse extends ApiResponse<IRoleModel> {}
export interface DeleteRoleResponse extends ApiResponse<{ message: string }> {}
