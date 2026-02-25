import { NextFunction, Request, Response } from 'express';
import * as userService from '../services/user.service';
import customError from '../utils/customError';
import userErrors from '../utils/errors/user.errors';

export const handleFetchUsersByCreator = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).UserId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const users = await userService.fetchUsersByCreator(userId);

    // Transform users to match frontend expectations
    const transformedUsers = users.map((user: any) => {
      const userJson = user.toJSON ? user.toJSON() : user;
      return {
        ...userJson,
        role: userJson.roles && userJson.roles.length > 0 ? userJson.roles[0] : null,
        isActive: true, // Default to true as User model has no status field yet
      };
    });

    res.json(transformedUsers);
  } catch (error) {
    next(customError(userErrors.UserFetchFailure));
  }
};

export const handleCreateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ error: 'Name, email, and password are required' });
    return;
  }

  try {
    const user = await userService.createUser({ name, email, password });
    res.status(201).json(user);
  } catch (error) {
    next(customError(userErrors.UserCreateFailure));
  }
};

export const handleUpdateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const id = req.params.id;
  const { name, email } = req.body;

  if (!id) {
    res.status(400).json({ error: 'User ID is required' });
    return;
  }

  try {
    const user = await userService.updateUser(id, { name, email });
    res.json(user);
  } catch (error) {
    next(customError(userErrors.UserUpdateFailure));
  }
};

export const handleDeleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const id = req.params.id;

  if (!id) {
    res.status(400).json({ error: 'User ID is required' });
    return;
  }

  try {
    await userService.deleteUser(id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(customError(userErrors.UserDeleteFailure));
  }
};

export const handleAssignRoleToUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = req.params.userId;
  const { roleId } = req.body;

  if (!userId || !roleId) {
    res.status(400).json({ error: 'User ID and Role ID are required' });
    return;
  }

  try {
    const result = await userService.assignRoleToUser(userId, roleId);
    res.json(result);
  } catch (error) {
    next(customError(userErrors.UserRoleAssignmentFailure));
  }
};

export const handleRemoveRoleFromUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = req.params.userId;
  const roleId = req.params.roleId;

  if (!userId || !roleId) {
    res.status(400).json({ error: 'User ID and Role ID are required' });
    return;
  }

  try {
    await userService.removeRoleFromUser(userId, roleId);
    res.json({ message: 'Role removed successfully' });
  } catch (error) {
    next(customError(userErrors.UserRoleRemovalFailure));
  }
};
