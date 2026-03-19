// @/services/permissionService.ts
import httpClient from "@/utils/httpClient";
import {
  PermissionsListResponse,
  CreatePermissionResponse,
  UpdatePermissionResponse,
  AddPermissionToRoleResponse
} from "@/interfaces/api";

export const fetchPermissions = async () => {
  const response = await httpClient.get<PermissionsListResponse>("/admin/permissions");
  return response.data.data;
};

export const createPermission = async (data: { name: string }) => {
  const response = await httpClient.post<CreatePermissionResponse>("/admin/permissions", data);
  return response.data.data;
};

export const updatePermission = async (id: string, data: { name: string }) => {
  const response = await httpClient.put<UpdatePermissionResponse>(`/admin/permissions/${id}`, data);
  return response.data.data;
};

export const deletePermission = async (id: string) => {
  await httpClient.delete(`/admin/permissions/${id}`);
};

export const addPermissionToRole = async (roleId: string, permissionId: string) => {
  const response = await httpClient.post<AddPermissionToRoleResponse>(`/admin/roles/${roleId}/permissions`, { permissionId });
  return response.data.data;
};

export const removePermissionFromRole = async (roleId: string, permissionId: string) => {
  await httpClient.delete(`/admin/roles/${roleId}/permissions/${permissionId}`);
};