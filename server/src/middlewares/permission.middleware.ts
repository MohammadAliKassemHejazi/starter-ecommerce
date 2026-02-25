import { Response, NextFunction } from 'express';
import db from '../models';
import { CustomRequest } from '../interfaces/types/middlewares/request.middleware.types';
import { raw } from 'body-parser';

// Middleware to check if the user has specific permissions
export const checkPermission = (requiredPermission: string) => {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.UserId;

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: User ID is missing' });
      }

      // Fetch the user's roles and permissions
      const uservalue = await db.User.findByPk(userId, {
        include: [
          {
            model: db.Role,
            as: 'roles', // ✅ Must match the alias in User.belongsToMany
            include: [
              {
                model: db.Permission,
                as: 'permissions', // ✅ Must match the alias in Role.belongsToMany
                attributes: ['name'],
              },
            ],
          },
        ],
      });
      const user = uservalue.get({ plain: true });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check if the user's role has the required permission
      const hasPermission = user.roles?.some((role: any) => role.permissions?.some((permission: any) => permission.name === requiredPermission));

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
