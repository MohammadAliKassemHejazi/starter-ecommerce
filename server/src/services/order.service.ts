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
    include: [{ model: db.OrderItem, as: "orderItems" }],
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
    include: [{ model: db.OrderItem, as: "orderItems" }],
  });

  if (!order) {
    throw customError(orderErrors.OrderNotFound);
  }

  return order.orderItems;
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
    include: [{ model: db.OrderItem, as: "orderItems" }],
  });

  return orders;
};

export const getOrdersByStore = async (
  storeId: string,
  page: number = 1,
  pageSize: number = 10,
  from?: string,
  to?: string
): Promise<{ rows: IOrderAttributes[]; count: number }> => {
  const offset = (page - 1) * pageSize;
  const whereClause: any = {};

  if (from && from !== "undefined") {
    whereClause.createdAt = { ...whereClause.createdAt, [Op.gte]: new Date(from) };
  }

  if (to && to !== "undefined") {
    whereClause.createdAt = { ...whereClause.createdAt, [Op.lte]: new Date(to) };
  }

  // Step 1: Get IDs and Count
  const { rows: idRows, count } = await db.Order.findAndCountAll({
    attributes: ['id'], // Fetch only IDs
    where: whereClause,
    include: [
      {
        model: db.OrderItem,
        as: "orderItems",
        attributes: [], // Don't fetch columns, just join
        required: true,
        include: [
          {
            model: db.Product,
            attributes: [], // Don't fetch columns, just join
            where: { storeId },
            required: true,
          },
        ],
      },
    ],
    distinct: true, // Ensure distinct Order IDs
    limit: pageSize,
    offset: offset,
    order: [["createdAt", "DESC"]],
  });

  // Step 2: Fetch Full Data if any IDs found
  if (count === 0) {
    return { rows: [], count: 0 };
  }

  const orderIds = idRows.map((row: any) => row.id);

  const rows = await db.Order.findAll({
    where: {
      id: {
        [Op.in]: orderIds,
      },
    },
    include: [
      {
        model: db.OrderItem,
        as: "orderItems",
        include: [
          {
            model: db.Product,
            where: { storeId },
            required: true,
          },
        ],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  return { rows, count };
};

export default {
  getLastOrder,
  getOrderItems,
  getOrdersByDateRange,
  getOrdersByStore,
};
