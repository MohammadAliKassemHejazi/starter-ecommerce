import { Request, Response } from 'express';
import db from '../models';
import { ResponseFormatter } from '../utils/responseFormatter';

export const getUserSessions = async (req: Request, res: Response) => {
  try {
    const { userId, deviceType, page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const whereClause: any = {};
    if (userId) whereClause.userId = userId;
    if (deviceType) whereClause.deviceType = deviceType;

    const { count, rows } = await db.UserSession.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: db.User,
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['loginAt', 'DESC']],
      limit: Number(limit),
      offset
    });

    ResponseFormatter.paginated(res, rows, Number(page), Number(limit), count, 'User sessions retrieved successfully');
  } catch (error) {
    console.error('Error getting user sessions:', error);
    ResponseFormatter.error(res, 'Failed to get user sessions', 500);
  }
};

export const createUserSession = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).UserId;
    const { ipAddress, deviceType } = req.body;

    const userSession = await db.UserSession.create({
      userId,
      ipAddress,
      deviceType,
      loginAt: new Date()
    });

    ResponseFormatter.success(res, userSession, 'User session created successfully', 201);
  } catch (error) {
    console.error('Error creating user session:', error);
    ResponseFormatter.error(res, 'Failed to create user session', 500);
  }
};

export const updateUserSession = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { logoutAt } = req.body;

    const userSession = await db.UserSession.findByPk(id);
    if (!userSession) {
      return ResponseFormatter.notFound(res, 'User session not found');
    }

    await userSession.update({ logoutAt: logoutAt || new Date() });

    ResponseFormatter.success(res, userSession, 'User session updated successfully');
  } catch (error) {
    console.error('Error updating user session:', error);
    ResponseFormatter.error(res, 'Failed to update user session', 500);
  }
};

export const deleteUserSession = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const userSession = await db.UserSession.findByPk(id);
    if (!userSession) {
      return ResponseFormatter.notFound(res, 'User session not found');
    }

    await userSession.destroy();

    ResponseFormatter.success(res, null, 'User session deleted successfully');
  } catch (error) {
    console.error('Error deleting user session:', error);
    ResponseFormatter.error(res, 'Failed to delete user session', 500);
  }
};

export const getActiveSessions = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const activeSessions = await db.UserSession.findAll({
      where: {
        userId,
        logoutAt: null
      },
      include: [
        {
          model: db.User,
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['loginAt', 'DESC']]
    });

    ResponseFormatter.success(res, activeSessions, 'Active sessions retrieved successfully');
  } catch (error) {
    console.error('Error getting active sessions:', error);
    ResponseFormatter.error(res, 'Failed to get active sessions', 500);
  }
};

export const terminateAllSessions = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    await db.UserSession.update(
      { logoutAt: new Date() },
      {
        where: {
          userId,
          logoutAt: null
        }
      }
    );

    ResponseFormatter.success(res, null, 'All sessions terminated successfully');
  } catch (error) {
    console.error('Error terminating sessions:', error);
    ResponseFormatter.error(res, 'Failed to terminate sessions', 500);
  }
};
