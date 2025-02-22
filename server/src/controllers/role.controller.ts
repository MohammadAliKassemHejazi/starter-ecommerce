import { NextFunction, Request, Response } from "express";
import * as  roleService  from "../services/role.service";
import customError from "../utils/customError";
import roleErrors from "../utils/errors/role.errors";

export const handleFetchRoles = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const roles = await roleService.fetchRoles();
    res.json(roles);
  } catch (error) {
    next(customError(roleErrors.RoleFetchFailure));
  }
};

export const handleCreateRole = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { name } = req.body;

  if (!name) {
    res.status(400).json({ error: "Role name is required" });
    return;
  }

  try {
    const role = await roleService.createRole(name);
    res.status(201).json(role);
  } catch (error) {
    next(customError(roleErrors.RoleCreateFailure));
  }
};

export const handleDeleteRole = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = req.params.id;

  if (!id) {
    res.status(400).json({ error: "Role ID is required" });
    return;
  }

  try {
    await roleService.deleteRole(id);
    res.json({ message: "Role deleted successfully" });
  } catch (error) {
    next(customError(roleErrors.RoleDeleteFailure));
  }
};

export const handleUpdateRole = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = req.params.id;
  const { name } = req.body;

  if (!id || !name) {
    res.status(400).json({ error: "Role ID and name are required" });
    return;
  }

  try {
    const role = await roleService.updateRole(id, name);
    res.json(role);
  } catch (error) {
    next(customError(roleErrors.RoleUpdateFailure));
  }
};