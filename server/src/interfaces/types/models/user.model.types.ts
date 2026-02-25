export interface IUserAttributes {
  id?: string;
  email: string;
  password: string;
  name?: string;
  address?: string;
  phone?: string;
  bio?: string;
  createdById?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
