import { CustomErrorParams } from "../customError";

export const MissingRequiredFields: CustomErrorParams = {
  message: "Missing required fields for audit log creation.",
  code: "AUDITLOG001",
  statusCode: 400,
};

export const AuditLogCreationFailure: CustomErrorParams = {
  message: "Failed to create audit log entry.",
  code: "AUDITLOG002",
  statusCode: 500,
};

export default {
  MissingRequiredFields,
  AuditLogCreationFailure,
};