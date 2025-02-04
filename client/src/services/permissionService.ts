// @/services/permissionService.ts
import httpClient from "@/utils/httpClient";

export const fetchPermissions = async () => {
  const response = await httpClient.get("/permissions");
  return response.data;
};

export const createPermission = async (data: { name: string }) => {
  const response = await httpClient.post("/permissions", data);
  return response.data;
};

export const updatePermission = async (id: string, data: { name: string }) => {
  const response = await httpClient.put(`/permissions/${id}`, data);
  return response.data;
};

export const deletePermission = async (id: string) => {
  await httpClient.delete(`/permissions/${id}`);
};

export const addPermissionToRole = async (roleId: string, permissionId: string) => {
  const response = await httpClient.post(`/roles/${roleId}/permissions`, { permissionId });
  return response.data;
};

export const removePermissionFromRole = async (roleId: string, permissionId: string) => {
  await httpClient.delete(`/roles/${roleId}/permissions/${permissionId}`);
};