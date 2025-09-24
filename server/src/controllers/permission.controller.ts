import { NextFunction, Request, Response } from "express";
import * as permissionService  from "../services/permission.service";
import customError from "../utils/customError";
import permissionErrors from "../utils/errors/permission.errors";
import { validationResult } from "express-validator";
import { CustomRequest } from "interfaces/types/middlewares/request.middleware.types";
import { isSuperAdmin } from "../services/package.service";

export const handleFetchPermissions = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const permissions = await permissionService.fetchPermissions();
    res.json(permissions);
  } catch (error) {
    next(customError(permissionErrors.PermissionFetchFailure));
  }
};

export const handleCreatePermission = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { name } = req.body;
  const userId = req.UserId;

  // Check if user is super admin
  const isAdmin = await isSuperAdmin(userId!);
  if (!isAdmin) {
    return res.status(403).json({ 
      success: false,
      message: 'Super admin privileges required to create permissions' 
    });
  }

  try {
    const permission = await permissionService.createPermission(name, userId!);
    res.status(201).json({
      success: true,
      permission,
      message: 'Permission created successfully'
    });
  } catch (error) {
    next(customError(permissionErrors.PermissionCreateFailure));
  }
};

export const handleUpdatePermission = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const id = req.params.id;
  const { name } = req.body;

  try {
    const permission = await permissionService.updatePermission(id, name, req["UserId"]!);
    res.json(permission);
  } catch (error) {
    next(customError(permissionErrors.PermissionUpdateFailure));
  }
};

export const handleDeletePermission = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const id = req.params.id;

  try {
    await permissionService.deletePermission(id, req["UserId"]!);
    res.json({ message: "Permission deleted successfully" });
  } catch (error) {
    next(customError(permissionErrors.PermissionDeleteFailure));
  }
};

export const handleAddPermissionToRole = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const roleId = req.params.roleId;
  const { permissionId } = req.body;

  try {
    const result = await permissionService.addPermissionToRole(roleId, permissionId, req["UserId"]!);
    res.json(result);
  } catch (error) {
    next(customError(permissionErrors.PermissionAssignmentFailure));
  }
};

export const handleRemovePermissionFromRole = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const roleId = req.params.roleId;
  const permissionId = req.params.permissionId;

  try {
    await permissionService.removePermissionFromRole(roleId, permissionId, req["UserId"]!);
    res.json({ message: "Permission removed successfully" });
  } catch (error) {
    next(customError(permissionErrors.PermissionRemovalFailure));
  }
};