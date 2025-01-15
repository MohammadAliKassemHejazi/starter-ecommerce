import { Response } from "express";
import { orderService } from "../services";
import { CustomRequest } from "../interfaces/types/middlewares/request.middleware.types";


export const getLastOrder = async (
  request: CustomRequest,
  response: Response,
  next: any
): Promise<void> => {
  try {
    const userId = request.UserId; // Assuming UserId is accessible via middleware
    const lastOrder = await orderService.getLastOrder(userId!);
    response.json(lastOrder);
  } catch (error) {
    next(error);
  }
};

export const getOrderItems = async (
  request: CustomRequest,
  response: Response,
  next: any
): Promise<void> => {
  try {
    const { orderId } = request.params;
    const userId = request.UserId; // Assuming UserId is accessible via middleware

    const orderItems = await orderService.getOrderItems(orderId, userId!);
    response.json({ orderId, items: orderItems });
  } catch (error) {
    next(error);
  }
};

export const getOrdersByDateRange = async (
  request: CustomRequest,
  response: Response,
  next: any
): Promise<void> => {
  try {
    const { from, to } = request.body; // Get from request body instead of query
    const userId = request.UserId;

    const orders = await orderService.getOrdersByDateRange(
      userId!,
      from as string,
      to as string
      );
  
    response.json(orders);
  } catch (error) {
    next(error);
  }
};

export default {
  getLastOrder,
  getOrderItems,
  getOrdersByDateRange,
};