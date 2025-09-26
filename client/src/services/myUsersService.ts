import httpClient from "@/utils/httpClient";
import { 
	UsersListResponse, 
	CreateUserResponse, 
	UpdateUserResponse, 
	DeleteUserResponse, 
	AssignRoleResponse, 
	RemoveRoleResponse 
} from "@/interfaces/api/user.types";

export const fetchUsersByCreator = async (): Promise<UsersListResponse> => {
  const { data: response } = await httpClient.get<UsersListResponse>("/users?createdById=me");
  return response;
};

export const createUser = async (data: { name: string; email: string; password: string }): Promise<CreateUserResponse> => {
  const { data: response } = await httpClient.post<CreateUserResponse>("/users", data);
  return response;
};

export const updateUser = async (data: { id: string; name?: string; email?: string }): Promise<UpdateUserResponse> => {
  const { data: response } = await httpClient.put<UpdateUserResponse>(`/users/${data.id}`, data);
  return response;
};

export const deleteUser = async (id: string): Promise<DeleteUserResponse> => {
  const { data: response } = await httpClient.delete<DeleteUserResponse>(`/users/${id}`);
  return response;
};

export const assignRoleToUser = async (data: { userId: string; roleId: string }): Promise<AssignRoleResponse> => {
  const { data: response } = await httpClient.post<AssignRoleResponse>(`/users/${data.userId}/roles`, {
    roleId: data.roleId,
  });
  return response;
};

export const removeRoleFromUser = async (data: { userId: string; roleId: string }): Promise<RemoveRoleResponse> => {
  const { data: response } = await httpClient.delete<RemoveRoleResponse>(`/users/${data.userId}/roles/${data.roleId}`);
  return response;
};
