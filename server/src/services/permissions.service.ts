import { IRoleAttributes } from '../interfaces/types/models/role.model.types';
import db from '../models';
import { IRoleUserAttributes } from '../interfaces/types/models/roleuser.model.types';
import { IPermissionAttributes } from '../interfaces/types/models/permission.model.types';
import { IRolePermissionAttributes } from '../interfaces/types/models/rolepermission.model.types';

const createRole = async (data: IRoleAttributes): Promise<IRoleAttributes> => {
  return await db.Role.create(data);
};

const getRoleById = async (id: string): Promise<IRoleAttributes | null> => {
  return await db.Role.findOne({ where: { id } });
};

const updateRole = async (id: string, updates: Partial<IRoleAttributes>): Promise<IRoleAttributes | null> => {
  const role = await db.Role.findOne({ where: { id } });
  if (role) {
    return await role.update(updates);
  }
  return null;
};

const deleteRole = async (id: string): Promise<boolean> => {
  const role = await db.Role.findOne({ where: { id } });
  if (role) {
    await role.destroy();
    return true;
  }
  return false;
};

const assignRoleToUser = async (roleId: string, userId: string): Promise<IRoleUserAttributes> => {
  return await db.RoleUser.create({ roleId, userId });
};

const getRoleUserById = async (id: string): Promise<IRoleUserAttributes | null> => {
  return await db.RoleUser.findOne({ where: { id } });
};

const updateRoleUser = async (id: string, updates: Partial<IRoleUserAttributes>): Promise<IRoleUserAttributes | null> => {
  const roleUser = await db.RoleUser.findOne({ where: { id } });
  if (roleUser) {
    return await roleUser.update(updates);
  }
  return null;
};

const removeRoleFromUser = async (id: string): Promise<boolean> => {
  const roleUser = await db.RoleUser.findOne({ where: { id } });
  if (roleUser) {
    await roleUser.destroy();
    return true;
  }
  return false;
};

const createPermission = async (data: IPermissionAttributes): Promise<IPermissionAttributes> => {
  return await db.Permission.create(data);
};

const getPermissionById = async (id: string): Promise<IPermissionAttributes | null> => {
  return await db.Permission.findOne({ where: { id } });
};

const updatePermission = async (id: string, updates: Partial<IPermissionAttributes>): Promise<IPermissionAttributes | null> => {
  const permission = await db.Permission.findOne({ where: { id } });
  if (permission) {
    return await permission.update(updates);
  }
  return null;
};

const deletePermission = async (id: string): Promise<boolean> => {
  const permission = await db.Permission.findOne({ where: { id } });
  if (permission) {
    await permission.destroy();
    return true;
  }
  return false;
};

const assignPermissionToRole = async (roleId: string, permissionId: string): Promise<IRolePermissionAttributes> => {
  return await db.RolePermission.create({ roleId, permissionId });
};

const getRolePermissionById = async (id: string): Promise<IRolePermissionAttributes | null> => {
  return await db.RolePermission.findOne({ where: { id } });
};

const updateRolePermission = async (id: string, updates: Partial<IRolePermissionAttributes>): Promise<IRolePermissionAttributes | null> => {
  const rolePermission = await db.RolePermission.findOne({ where: { id } });
  if (rolePermission) {
    return await rolePermission.update(updates);
  }
  return null;
};

const removePermissionFromRole = async (id: string): Promise<boolean> => {
  const rolePermission = await db.RolePermission.findOne({ where: { id } });
  if (rolePermission) {
    await rolePermission.destroy();
    return true;
  }
  return false;
};

export default {
  removePermissionFromRole,
  updateRolePermission,
  getRolePermissionById,
  assignPermissionToRole,
  deletePermission,
  updatePermission,
  createPermission,
  getPermissionById,
  removeRoleFromUser,
  updateRoleUser,
  getRoleUserById,
  assignRoleToUser,
  deleteRole,
  updateRole,
  getRoleById,
  createRole,
};
