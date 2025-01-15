import { IOrderItemAttributes } from "interfaces/types/models/orderitem.model.types";
import { IOrderAttributes } from "../interfaces/types/models/order.model.types";
import db from "../models";
import customError from "../utils/customError";
import orderErrors from "../utils/errors/order.errors";
import { Op } from "sequelize";

export const getLastOrder = async (
  userId: string
): Promise<IOrderAttributes> => {
  const lastOrder = await db.Order.findOne({
    where: { userId },
    order: [["createdAt", "DESC"]], // Get the most recent order
    include: [{ model: db.OrderItem, as: "items" }],
  });

  if (!lastOrder) {
    throw customError(orderErrors.OrderNotFound);
  }

  return lastOrder;
};

export const getOrderItems = async (
  orderId: string,
  userId: string
): Promise<IOrderItemAttributes[]> => {
  const order = await db.Order.findOne({
    where: { id: orderId, userId },
    include: [{ model: db.OrderItem, as: "items" }],
  });

  if (!order) {
    throw customError(orderErrors.OrderNotFound);
  }

  return order.items.toJSON();
};

export const getOrdersByDateRange = async (
  userId: string,
  from: string,
  to: string
): Promise<IOrderAttributes[]> => {
  const orders = await db.Order.findAll({
    where: {
      userId,
      createdAt: {
        [Op.between]: [new Date(from), new Date(to)],
      },
    },
    include: [{ model: db.OrderItem, as: "items" }],
  });

  return orders;
};

export default {
  getLastOrder,
  getOrderItems,
  getOrdersByDateRange,
};