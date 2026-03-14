import { UserModel } from "./user.model";

export interface SignIn {
  data: UserModel;
  message?: string;
  success?: boolean;
}

export interface SignUp {
  data: {
    id: string;
    email: string;
    name: string;
    address: string;
    phone: string;
  };
  message?: string;
  success?: boolean;
}

export interface GetSession {
  data: UserModel;
  message?: string;
  success?: boolean;
}
