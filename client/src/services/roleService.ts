import httpClient from "@/utils/httpClient";

export const fetchRoles = async () => {
  const response = await httpClient.get("/roles");
  return response.data;
};

export const createRole = async (data: { name: string }) => {
  const response = await httpClient.post("/roles", data);
  return response.data;
};

export const deleteRole = async (id: string) => {
  await httpClient.delete(`/roles/${id}`);
};

export const updateRole = async (data: { id: string; name: string }) => {
  const response = await httpClient.put(`/roles/${data.id}`, { name: data.name });
  return response.data;
};