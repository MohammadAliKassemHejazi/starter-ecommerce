import { CustomErrorParams } from "../customError";

export const RoleFetchFailure: CustomErrorParams = {
  message: "Failed to fetch roles.",
  code: "ROLE001",
  statusCode: 400,
};

export const RoleCreateFailure: CustomErrorParams = {
  message: "Failed to create role.",
  code: "ROLE002",
  statusCode: 400,
};

export const RoleUpdateFailure: CustomErrorParams = {
  message: "Failed to update role.",
  code: "ROLE003",
  statusCode: 400,
};

export const RoleDeleteFailure: CustomErrorParams = {
  message: "Failed to delete role.",
  code: "ROLE004",
  statusCode: 400,
};

export const RoleNotFound: CustomErrorParams = {
  message: "Role not found.",
  code: "ROLE005",
  statusCode: 404,
};

export const InvalidRoleName: CustomErrorParams = {
  message: "Role name is invalid or missing.",
  code: "ROLE006",
  statusCode: 400,
};

export default {
  RoleFetchFailure,
  RoleCreateFailure,
  RoleUpdateFailure,
  RoleDeleteFailure,
  RoleNotFound,
  InvalidRoleName,
};