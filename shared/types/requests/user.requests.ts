// User Request Body Types

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  address: string;
  phone: string;
  bio?: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  address?: string;
  phone?: string;
  bio?: string;
  isActive?: boolean;
}

export interface AssignRoleRequest {
  roleId: string;
}
