import { Response } from 'express';
import { IAuthLoginBodyResponse } from '../interfaces/types/controllers/auth.controller.types';
import { userService } from '../services';
import { CustomRequest } from '../interfaces/types/middlewares/request.middleware.types';

export const handleUserProfile = async (request: CustomRequest, response: Response): Promise<void> => {
  const UserId = request.UserId;
  try {
    const user: IAuthLoginBodyResponse = await userService.getUserById(UserId!);
    response.status(200).json({ success: true, message: 'User profile retrieved successfully', data: user });
  } catch (error) {
    response.status(500).json({ success: false, message: 'Internal Server Error', data: null });
  }
};

export default {
  handleUserProfile,
};
