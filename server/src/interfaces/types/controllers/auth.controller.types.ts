import { Request } from "express";

export interface IAuthLoginBodyRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

export interface IAuthRegisterBodyRequest extends Request {
  body: {
    email: string;
    password: string;
    name: string;
    surname: string;
    phone: string;
  };
}

export interface IAuthLoginBodyResponse {
  id: string;
  email: string;
  name: string;
  surname: string;
  phone: string;
  accessToken?: string;
}
