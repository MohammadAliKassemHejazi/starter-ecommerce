import {  Response, NextFunction } from 'express';
import db from "../models";
import { CustomRequest } from '../interfaces/types/middlewares/request.middleware.types';

// Middleware to check if the user has specific permissions
export const checkPermission = (requiredPermission: string) => {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.UserId; 

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: User ID is missing' });
      }

      // Fetch the user's roles and permissions
      const user = await db.User.findByPk(userId, {
        include: {
          model: db.Role,
          include: {
            model: db.Permission, // Assuming Role has many Permissions
            attributes: ['name'] // Fetch only the 'name' attribute for permissions
          }
        }
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check if the user's role has the required permission
      const hasPermission = user.Roles?.some((role: any) =>
        role.Permissions?.some((permission: any) => permission.name === requiredPermission)
      );

      if (!hasPermission) {
        return res.status(403).json({ message: 'Forbidden: You do not have the required permission' });
      }

      next();
    } catch (error) {
      console.error('Error checking permissions:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
};
