import { CustomErrorParams } from "../customError";

export const PermissionFetchFailure: CustomErrorParams = {
  message: "Failed to fetch permissions.",
  code: "PERMISSION001",
  statusCode: 400,
};

export const PermissionCreateFailure: CustomErrorParams = {
  message: "Failed to create permission.",
  code: "PERMISSION002",
  statusCode: 400,
};

export const PermissionUpdateFailure: CustomErrorParams = {
  message: "Failed to update permission.",
  code: "PERMISSION003",
  statusCode: 400,
};

export const PermissionDeleteFailure: CustomErrorParams = {
  message: "Failed to delete permission.",
  code: "PERMISSION004",
  statusCode: 400,
};

export const PermissionNotFound: CustomErrorParams = {
  message: "Permission not found.",
  code: "PERMISSION005",
  statusCode: 404,
};

export const InvalidPermissionName: CustomErrorParams = {
  message: "Permission name is invalid or missing.",
  code: "PERMISSION006",
  statusCode: 400,
};

export const PermissionAssignmentFailure: CustomErrorParams = {
  message: "Failed to assign permission to role.",
  code: "PERMISSION007",
  statusCode: 400,
};

export const PermissionRemovalFailure: CustomErrorParams = {
  message: "Failed to remove permission from role.",
  code: "PERMISSION008",
  statusCode: 400,
};

export const PermissionNotAssignedToRole: CustomErrorParams = {
  message: "Permission is not assigned to the specified role.",
  code: "PERMISSION009",
  statusCode: 404,
};

export default {
  PermissionFetchFailure,
  PermissionCreateFailure,
  PermissionUpdateFailure,
  PermissionDeleteFailure,
  PermissionNotFound,
  InvalidPermissionName,
  PermissionAssignmentFailure,
  PermissionRemovalFailure,
  PermissionNotAssignedToRole,
};