import { NextFunction, Request, Response } from "express";
import * as dashboardService from "../services/dashboard.service";
import customError from "../utils/customError";
import dashboardErrors from "../utils/errors/dashboard.errors";
import { CustomRequest } from "interfaces/types/middlewares/request.middleware.types";

export const handleGetSalesData = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
           const userId = req.UserId;
    if (!userId) {
      return next(customError(dashboardErrors.OrderStatusesFetchFailure));
    }
    const usersids = await dashboardService.getManagedUserIds(userId);
    const salesData = await dashboardService.getSalesData(usersids);
    res.json(salesData);
  } catch (error) {
    next(customError(dashboardErrors.SalesDataFetchFailure));
  }
};

export const handleGetInventoryAlerts = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
        const userId = req.UserId;
    if (!userId) {
      return next(customError(dashboardErrors.OrderStatusesFetchFailure));
    }
    const usersids = await dashboardService.getManagedUserIds(userId);
    const inventoryAlerts = await dashboardService.getInventoryAlerts(usersids);
    res.json(inventoryAlerts);
  } catch (error) {
    next(customError(dashboardErrors.InventoryAlertsFetchFailure));
  }
};

export const handleGetOrderStatuses = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.UserId;
    if (!userId) {
      return next(customError(dashboardErrors.OrderStatusesFetchFailure));
    }
    const usersids = await dashboardService.getManagedUserIds(userId);
    
    const orderStatuses = await dashboardService.getOrderStatuses(usersids);
    res.json(orderStatuses);
  } catch (error) {
    next(customError(dashboardErrors.OrderStatusesFetchFailure));
  }
};