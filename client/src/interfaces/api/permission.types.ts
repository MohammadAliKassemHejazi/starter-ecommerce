import { ApiResponse } from './apiResponse.types';
import { IPermissionModel, IRoleModel } from './role.types';

// Permission Domain Model mapping to backend IPermissionAttributes
export interface PermissionResponse extends ApiResponse<IPermissionModel> {}
export interface PermissionsListResponse extends ApiResponse<IPermissionModel[]> {}
export interface CreatePermissionResponse extends ApiResponse<IPermissionModel> {}
export interface UpdatePermissionResponse extends ApiResponse<IPermissionModel> {}
export interface DeletePermissionResponse extends ApiResponse<{ message: string }> {}

export interface AddPermissionToRoleResponse extends ApiResponse<any> {}
export interface RemovePermissionFromRoleResponse extends ApiResponse<{ message: string }> {}
