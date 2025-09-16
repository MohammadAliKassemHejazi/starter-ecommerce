import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { IUserAttributes } from "../interfaces/types/models/user.model.types";
import customError from "../utils/customError";
import authErrors from "../utils/errors/auth.errors";
import config from "../config/config";
import { IAuthLoginBodyResponse } from "../interfaces/types/controllers/auth.controller.types";
import db from "../models";

const passwordHashing = (password: string): string => {
  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(password, salt);
  return hashPassword;
};

const comparePassword = (password: string, existsPassword: string): boolean => {
  const isPasswordCorrect = bcrypt.compareSync(password, existsPassword);
  if (!isPasswordCorrect) {
    customError(authErrors.AuthInvalidPassword);
  }
  return true;
};

const createToken = (UserId: string): string => {
  const token = sign({}, config.webtoken as string, {
    expiresIn: 3600 * 30,
    audience: String(UserId),
  });
  return token;
};

const mapUserResponseObject = async (
  userId: string,
  user: IUserAttributes,
  accessToken?: string
): Promise<IAuthLoginBodyResponse> => {
  // Fetch user with roles and permissions
  const userWithRoles = await db.User.findByPk(userId, {
    include: [
      {
        model: db.Role,
        as: 'roles',
        through: { attributes: [] }, // Exclude join table attributes
        include: [
          {
            model: db.Permission,
            as: 'permissions',
            through: { attributes: [] } // Exclude join table attributes
          }
        ]
      }
    ]
  });

  // Extract roles and permissions
  const roles = userWithRoles?.roles?.map((role: any) => ({
    id: role.id,
    name: role.name
  })) || [];

  const permissions = userWithRoles?.roles?.flatMap((role: any) => 
    role.permissions?.map((permission: any) => ({
      id: permission.id,
      name: permission.name
    })) || []
  ) || [];

  const response: IAuthLoginBodyResponse = {
    id: userId,
    email: user.email,
    name: user.name || "",
    address: user.address || "",
    phone: user.phone || "",
    accessToken,
    roles,
    permissions
  };
  return response;
};

export const createUser = async (
  data: IUserAttributes
): Promise<IUserAttributes> => {
  data.password = passwordHashing(data.password);
  
  // Find admin user to set as createdByUser
  const adminUser = await db.User.findOne({
    where: { email: 'admin@admin.com' } // Assuming admin email
  });
  
  if (adminUser) {
    data.createdById = adminUser.id;
  }
  
  const user: IUserAttributes = await db.User.create(data);
  return user;
};

export const userLogin = async (
  email: string,
  password: string
): Promise<IAuthLoginBodyResponse> => {
  const user = await db.User.findOne({
    where: { email }, raw: true
  });
  if (user == null) {
    customError({
      ...authErrors.AuthInvalidEmail,
      data: {
        success: false,
      },
    });
  }
  // console.log("debugging", email, password, user)
  comparePassword(password, user.password);
  const UserId: string = user.id;
  const accessToken = createToken(UserId);
  const response: IAuthLoginBodyResponse = await mapUserResponseObject(
    UserId,
    user,
    accessToken
  );
  return response;
};

export const userSession = async (
  id: string,
): Promise<IAuthLoginBodyResponse> => {
  const user = await db.User.findOne({
    where: { id }, raw: true
  });
  if (user == null) {
    customError({
      ...authErrors.AuthJWTError,
      data: {
        success: false,
      },
    });
  }
  const UserId: string = id;
  const accessToken = createToken(UserId);
  const response: IAuthLoginBodyResponse = await mapUserResponseObject(
    UserId,
    user,
    accessToken
  );
  return response;
};

export const getUserById = async (
  UserId: string
): Promise<IAuthLoginBodyResponse> => {
  const user = await db.User.findOne({ where: { id: UserId }, raw: true });
  if (user == null) {
     customError(authErrors.AuthJWTError);
  }
  const response: IAuthLoginBodyResponse = await mapUserResponseObject(UserId, user);
  return response;
};

export default {
  createUser,
  userLogin,
  getUserById,
  createToken,
  userSession
};
