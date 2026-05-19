import { NextFunction, Request, Response } from 'express';
import * as dashboardService from '../services/dashboard.service';
import * as utilService from '../services/utile.service';
import customError from '../utils/customError';
import dashboardErrors from '../utils/errors/dashboard.errors';
import { CustomRequest } from 'interfaces/types/middlewares/request.middleware.types';

export const handleGetSalesData = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.UserId;
    if (!userId) {
      return next(customError(dashboardErrors.OrderStatusesFetchFailure));
    }
    const usersids = await utilService.getManagedUserIds(userId);
    const salesData = await dashboardService.getSalesData(usersids);
    res.json({ success: true, message: 'Sales data retrieved successfully', data: salesData });
  } catch (error) {
    next(customError(dashboardErrors.SalesDataFetchFailure));
  }
};

export const handleGetInventoryAlerts = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.UserId;
    if (!userId) {
      return next(customError(dashboardErrors.OrderStatusesFetchFailure));
    }
    const usersids = await utilService.getManagedUserIds(userId);
    const inventoryAlerts = await dashboardService.getInventoryAlerts(usersids);
    res.json({ success: true, message: 'Inventory alerts retrieved successfully', data: inventoryAlerts });
  } catch (error) {
    next(customError(dashboardErrors.InventoryAlertsFetchFailure));
  }
};

export const handleGetOrderStatuses = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.UserId;
    if (!userId) {
      return next(customError(dashboardErrors.OrderStatusesFetchFailure));
    }
    const usersids = await utilService.getManagedUserIds(userId);

    const orderStatuses = await dashboardService.getOrderStatuses(usersids);
    res.json({ success: true, message: 'Order statuses retrieved successfully', data: orderStatuses });
  } catch (error) {
    next(customError(dashboardErrors.OrderStatusesFetchFailure));
  }
};
