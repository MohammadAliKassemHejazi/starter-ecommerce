import { NextFunction, Request, Response } from "express";
import * as  roleService  from "../services/role.service";
import customError from "../utils/customError";
import roleErrors from "../utils/errors/role.errors";
import { CustomRequest } from "../interfaces/types/middlewares/request.middleware.types";
import { isSuperAdmin } from "../services/package.service";

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
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { name } = req.body;
  const userId = req.UserId;

  if (!name) {
    res.status(400).json({ error: "Role name is required" });
    return;
  }

  // Check if user is super admin
  const isAdmin = await isSuperAdmin(userId!);
  if (!isAdmin) {
    res.status(403).json({ 
      success: false,
      message: 'Super admin privileges required to create roles' 
    });
    return;
  }

  try {
    const role = await roleService.createRole(name);
    res.status(201).json({
      success: true,
      role,
      message: 'Role created successfully'
    });
  } catch (error) {
    next(customError(roleErrors.RoleCreateFailure));
  }
};

export const handleDeleteRole = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = req.params.id;
  const userId = req.UserId;

  if (!id) {
    res.status(400).json({ error: "Role ID is required" });
    return;
  }

  // Check if user is super admin
  const isAdmin = await isSuperAdmin(userId!);
  if (!isAdmin) {
    res.status(403).json({ 
      success: false,
      message: 'Super admin privileges required to delete roles' 
    });
    return;
  }

  try {
    await roleService.deleteRole(id);
    res.json({ 
      success: true,
      message: "Role deleted successfully" 
    });
  } catch (error) {
    next(customError(roleErrors.RoleDeleteFailure));
  }
};

export const handleUpdateRole = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = req.params.id;
  const { name } = req.body;
  const userId = req.UserId;

  if (!id || !name) {
    res.status(400).json({ error: "Role ID and name are required" });
    return;
  }

  // Check if user is super admin
  const isAdmin = await isSuperAdmin(userId!);
  if (!isAdmin) {
    res.status(403).json({ 
      success: false,
      message: 'Super admin privileges required to update roles' 
    });
    return;
  }

  try {
    const role = await roleService.updateRole(id, name);
    res.json({
      success: true,
      role,
      message: 'Role updated successfully'
    });
  } catch (error) {
    next(customError(roleErrors.RoleUpdateFailure));
  }
};