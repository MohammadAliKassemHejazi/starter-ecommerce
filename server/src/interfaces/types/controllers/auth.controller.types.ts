import { Request } from "express";
import { IAuthUser } from "@shared/types/auth.types";

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
    address: string;
    phone: string;
  };
}

// Re-export shared auth user type under the legacy name for backward compatibility
export type IAuthLoginBodyResponse = IAuthUser;
