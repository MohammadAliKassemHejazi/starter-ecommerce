import httpClient from "@/utils/httpClient";
import {
  RolesListResponse,
  CreateRoleResponse,
  UpdateRoleResponse,
} from "@shared/types/role.types";

export const fetchRoles = async () => {
  const response = await httpClient.get<RolesListResponse>("/admin/roles");
  return response.data.data;
};

export const createRole = async (data: { name: string }) => {
  const response = await httpClient.post<CreateRoleResponse>("/admin/roles", data);
  return response.data.data;
};

export const deleteRole = async (id: string) => {
  await httpClient.delete(`/admin/roles/${id}`);
};

export const updateRole = async (data: { id: string; name: string }) => {
  const response = await httpClient.put<UpdateRoleResponse>(`/admin/roles/${data.id}`, { name: data.name });
  return response.data.data;
};