import httpClient from "@/utils/httpClient";

export const fetchRoles = async () => {
  const response = await httpClient.get("/admin/roles");
  return response.data;
};

export const createRole = async (data: { name: string }) => {
  const response = await httpClient.post("/admin/roles", data);
  return response.data;
};

export const deleteRole = async (id: string) => {
  await httpClient.delete(`/admin/roles/${id}`);
};

export const updateRole = async (data: { id: string; name: string }) => {
  const response = await httpClient.put(`/admin/roles/${data.id}`, { name: data.name });
  return response.data;
};