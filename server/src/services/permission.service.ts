import db from '../models';
import { IPermissionAttributes } from '../interfaces/types/models/permission.model.types';
import { createAuditLog } from '../services/auditLog.service';
import customError from '../utils/customError';
import permissionErrors from '../utils/errors/permission.errors';

export const fetchPermissions = async (): Promise<IPermissionAttributes[]> => {
  const permissions = await db.Permission.findAll();
  return permissions;
};

export const createPermission = async (name: string, performedById: string): Promise<IPermissionAttributes> => {
  if (!name) {
    throw customError(permissionErrors.InvalidPermissionName);
  }

  const permission = await db.Permission.create({ name });
  await createAuditLog('CREATE', 'Permission', permission.id, performedById, { name });

  return permission;
};

export const updatePermission = async (id: string, name: string, performedById: string): Promise<IPermissionAttributes> => {
  const permission = await db.Permission.findByPk(id);
  if (!permission) {
    throw customError(permissionErrors.PermissionNotFound);
  }

  const previousState = permission.toJSON();
  permission.name = name;
  await permission.save();

  await createAuditLog('UPDATE', 'Permission', id, performedById, {
    previousState,
    updatedData: { name },
  });

  return permission;
};

export const deletePermission = async (id: string, performedById: string): Promise<void> => {
  const permission = await db.Permission.findByPk(id);
  if (!permission) {
    throw customError(permissionErrors.PermissionNotFound);
  }

  const snapshot = permission.toJSON();
  await permission.destroy();
  await createAuditLog('DELETE', 'Permission', id, performedById, snapshot);
};

export const addPermissionToRole = async (roleId: string, permissionId: string, performedById: string): Promise<any> => {
  const rolePermission = await db.RolePermission.create({ roleId, permissionId });
  await createAuditLog('ASSIGN', 'RolePermission', `${roleId}-${permissionId}`, performedById, { roleId, permissionId });

  return rolePermission;
};

export const removePermissionFromRole = async (roleId: string, permissionId: string, performedById: string): Promise<void> => {
  const rolePermission = await db.RolePermission.findOne({ where: { roleId, permissionId } });
  if (!rolePermission) {
    throw customError(permissionErrors.PermissionNotAssignedToRole);
  }

  await rolePermission.destroy();
  await createAuditLog('REMOVE', 'RolePermission', `${roleId}-${permissionId}`, performedById, { roleId, permissionId });
};
