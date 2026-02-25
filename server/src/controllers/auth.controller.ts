import { Response } from 'express';
import { userService } from '../services';
import db from '../models';
import { IAuthLoginBodyRequest, IAuthRegisterBodyRequest } from '../interfaces/types/controllers/auth.controller.types';
import authErrors from '../utils/errors/auth.errors';
import { IUserAttributes } from '../interfaces/types/models/user.model.types';
import { CustomRequest } from '../interfaces/types/middlewares/request.middleware.types';

export const handleLogin = async (request: IAuthLoginBodyRequest, response: Response, next: any) => {
  const { email, password } = request.body;
  try {
    const login = await userService.userLogin(email, password);

    // Automatically create user session on login
    if (login.id) {
      await db.UserSession.create({
        userId: login.id,
        ipAddress: request.ip || request.connection.remoteAddress,
        deviceType: request.get('User-Agent') || 'Unknown',
        loginAt: new Date(),
      });
    }

    response.json(login);
  } catch (error) {
    next(authErrors.AuthInvalidEmail);
  }
};

export const handleRegister = async (request: IAuthRegisterBodyRequest, response: Response, next: any): Promise<void> => {
  const { email, password, name, address, phone } = request.body;
  try {
    const user: IUserAttributes = await userService.createUser({
      email,
      password,
      name,
      address,
      phone,
    });
    response.status(201).json(user);
  } catch (error) {
    next(authErrors.AuthRegisterFailure);
  }
};

export const isAuthenticated = async (request: CustomRequest, response: Response, next: any): Promise<void> => {
  try {
    const UserId = request.UserId; // Assuming UserId is accessible via middleware
    const userSession = await userService.userSession(UserId!);
    response.json(userSession);
  } catch (e) {
    next(e);
  }
};

export const getUserSessions = async (request: CustomRequest, response: Response, next: any): Promise<void> => {
  try {
    const UserId = request.UserId;
    const { page = 1, limit = 10 } = request.query;
    const offset = (Number(page) - 1) * Number(limit);
    if (!UserId) {
      const { count, rows } = await db.UserSession.findAndCountAll({
        where: { userId: UserId },
        order: [['loginAt', 'DESC']],
        limit: Number(limit),
        offset,
      });

      response.status(200).json({
        success: true,
        sessions: rows,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: count,
          pages: Math.ceil(count / Number(limit)),
        },
      });
    } else {
      response.status(200).json({ success: true, sessions: [], pagination: null });
    }
  } catch (error) {
    console.error('Error getting user sessions:', error);
    next(error);
  }
};

export const loggedOut = async (request: CustomRequest, response: Response): Promise<void> => {
  const UserId = request.UserId;

  try {
    // Automatically update user session on logout
    if (UserId) {
      await db.UserSession.update(
        { logoutAt: new Date() },
        {
          where: {
            userId: UserId,
            logoutAt: null, // Only update active sessions
          },
        },
      );
    }

    response.status(200).json({
      success: true,
      message: 'Logged out successfully',
      userId: UserId,
    });
  } catch (error) {
    console.error('Error during logout:', error);
    response.status(500).json({
      success: false,
      message: 'Logout failed',
    });
  }
};

export default {
  handleLogin,
  handleRegister,
  isAuthenticated,
  getUserSessions,
  loggedOut,
};
