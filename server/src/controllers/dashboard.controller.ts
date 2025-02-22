import { NextFunction, Request, Response } from "express";
import * as dashboardService from "../services/dashboard.service";
import customError from "../utils/customError";
import dashboardErrors from "../utils/errors/dashboard.errors";

export const handleGetSalesData = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const salesData = await dashboardService.getSalesData();
    res.json(salesData);
  } catch (error) {
    next(customError(dashboardErrors.SalesDataFetchFailure));
  }
};

export const handleGetInventoryAlerts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const inventoryAlerts = await dashboardService.getInventoryAlerts();
    res.json(inventoryAlerts);
  } catch (error) {
    next(customError(dashboardErrors.InventoryAlertsFetchFailure));
  }
};

export const handleGetOrderStatuses = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const orderStatuses = await dashboardService.getOrderStatuses();
    res.json(orderStatuses);
  } catch (error) {
    next(customError(dashboardErrors.OrderStatusesFetchFailure));
  }
};