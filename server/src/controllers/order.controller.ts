import { Response } from "express";
import { orderService } from "../services";
import { CustomRequest } from "../interfaces/types/middlewares/request.middleware.types";

import orderErrors from "../utils/errors/order.errors";

export const createOrder = async (
  request: CustomRequest,
  response: Response,
  next: any
): Promise<void> => {
  try {
    const { items, paymentId } = request.body;
    const userId = request.UserId; // Assuming UserId is accessible via middleware

    const order = await orderService.createOrder(userId!, items, paymentId);
    response.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (
  request: CustomRequest,
  response: Response,
  next: any
): Promise<void> => {
  try {
    const { orderId } = request.params;
    const userId = request.UserId; // Assuming UserId is accessible via middleware

    const order = await orderService.getOrderById(orderId, userId!);
    response.json(order);
  } catch (error) {
    next(error);
  }
};

export const getOrdersByUser = async (
  request: CustomRequest,
  response: Response,
  next: any
): Promise<void> => {
  try {
    const userId = request.UserId; // Assuming UserId is accessible via middleware

    const orders = await orderService.getOrdersByUser(userId!);
    response.json(orders);
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
    const { from, to } = request.query;
    const userId = request.UserId; // Assuming UserId is accessible via middleware

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
  createOrder,
  getOrderById,
  getOrdersByUser,
  getOrdersByDateRange,
};