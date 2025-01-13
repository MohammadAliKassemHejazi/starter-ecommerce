import { IOrderItemAttributes } from "interfaces/types/models/orderitem.model.types";
import { IOrderAttributes } from "../interfaces/types/models/order.model.types";
   
import db from "../models";
import customError from "../utils/customError";
import orderErrors from "../utils/errors/order.errors";

export const createOrder = async (
  userId: string,
  items: IOrderItemAttributes[],
  paymentId: string
): Promise<IOrderAttributes> => {
  try {
    const order = await db.Order.create({
      userId,
      paymentId,
    });

    const orderItems = items.map((item) => ({
      ...item,
      orderId: order.id,
    }));

    await db.OrderItem.bulkCreate(orderItems);

    return order;
  } catch (error) {
    throw customError(orderErrors.OrderCreationFailed);
  }
};

export const getOrderById = async (
  orderId: string,
  userId: string
): Promise<IOrderAttributes> => {
  const order = await db.Order.findOne({
    where: { id: orderId, userId },
    include: [{ model: db.OrderItem, as: "items" }],
  });

  if (!order) {
    throw customError(orderErrors.OrderNotFound);
  }

  return order;
};

export const getOrdersByUser = async (
  userId: string
): Promise<IOrderAttributes[]> => {
  const orders = await db.Order.findAll({
    where: { userId },
    include: [{ model: db.OrderItem, as: "items" }],
  });

  return orders;
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
        [db.Sequelize.Op.between]: [new Date(from), new Date(to)],
      },
    },
    include: [{ model: db.OrderItem, as: "items" }],
  });

  return orders;
};

export default {
  createOrder,
  getOrderById,
  getOrdersByUser,
  getOrdersByDateRange,
};