import httpClient from "@/utils/httpClient";

export const fetchUsersByCreator = async () => {
  const response = await httpClient.get("/users?createdById=me");
  return response.data;
};

export const createUser = async (data: { name: string; email: string; password: string }) => {
  const response = await httpClient.post("/users", data);
  return response.data;
};

export const updateUser = async (data: { id: string; name?: string; email?: string }) => {
  const response = await httpClient.put(`/users/${data.id}`, data);
  return response.data;
};

export const deleteUser = async (id: string) => {
  await httpClient.delete(`/users/${id}`);
};

export const assignRoleToUser = async (data: { userId: string; roleId: string }) => {
  const response = await httpClient.post(`/users/${data.userId}/roles`, {
    roleId: data.roleId,
  });
  return response.data;
};

export const removeRoleFromUser = async (data: { userId: string; roleId: string }) => {
  await httpClient.delete(`/users/${data.userId}/roles/${data.roleId}`);
};
