import { ApiResponse } from './apiResponse.types';
import { IPermission, IRole } from './role.types';

// Permission API Response Types
export interface PermissionResponse extends ApiResponse<IPermission> {}
export interface PermissionsListResponse extends ApiResponse<IPermission[]> {}
export interface CreatePermissionResponse extends ApiResponse<IPermission> {}
export interface UpdatePermissionResponse extends ApiResponse<IPermission> {}
export interface DeletePermissionResponse extends ApiResponse<{ message: string }> {}

export interface AddPermissionToRoleResponse extends ApiResponse<IRole> {}
export interface RemovePermissionFromRoleResponse extends ApiResponse<{ message: string }> {}
