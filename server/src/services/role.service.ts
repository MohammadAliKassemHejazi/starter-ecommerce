import db from "../models";
import { IRoleAttributes } from "../interfaces/types/models/role.model.types";
import customError from "../utils/customError";
import roleErrors from "../utils/errors/role.errors";

export const fetchRoles = async (): Promise<IRoleAttributes[]> => {
  const roles = await db.Role.findAll();
  return roles;
};

export const createRole = async (name: string): Promise<IRoleAttributes> => {
  if (!name) {
    throw customError(roleErrors.InvalidRoleName);
  }

  const role = await db.Role.create({ name });
  return role;
};

export const deleteRole = async (id: string): Promise<void> => {
  const role = await db.Role.findByPk(id);
  if (!role) {
    throw customError(roleErrors.RoleNotFound);
  }

  await role.destroy();
};

export const updateRole = async (id: string, name: string): Promise<IRoleAttributes> => {
  const role = await db.Role.findByPk(id);
  if (!role) {
    throw customError(roleErrors.RoleNotFound);
  }

  role.name = name;
  await role.save();

  return role;
};