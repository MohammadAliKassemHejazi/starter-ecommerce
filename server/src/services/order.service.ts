import { IOrderItemAttributes } from 'interfaces/types/models/orderitem.model.types';
import { IOrderAttributes } from '../interfaces/types/models/order.model.types';
import db from '../models';
import customError from '../utils/customError';
import orderErrors from '../utils/errors/order.errors';
import { Op } from 'sequelize';

export const getLastOrder = async (userId: string): Promise<IOrderAttributes> => {
  const lastOrder = await db.Order.findOne({
    where: { userId },
    order: [['createdAt', 'DESC']], // Get the most recent order
    include: [{ model: db.OrderItem, as: 'orderItems' }],
  });

  if (!lastOrder) {
    throw customError(orderErrors.OrderNotFound);
  }

  return lastOrder;
};

export const getOrderItems = async (orderId: string, userId: string): Promise<IOrderItemAttributes[]> => {
  const order = await db.Order.findOne({
    where: { id: orderId, userId },
    include: [{ model: db.OrderItem, as: 'orderItems' }],
  });

  if (!order) {
    throw customError(orderErrors.OrderNotFound);
  }

  return order.orderItems;
};

export const getOrdersByDateRange = async (userId: string, from: string, to: string): Promise<IOrderAttributes[]> => {
  const orders = await db.Order.findAll({
    where: {
      userId,
      createdAt: {
        [Op.between]: [new Date(from), new Date(to)],
      },
    },
    include: [{ model: db.OrderItem, as: 'orderItems' }],
  });

  return orders;
};

export const getOrdersByStore = async (
  storeId: string,
  page: number = 1,
  pageSize: number = 10,
  from?: string,
  to?: string,
): Promise<{ rows: any[]; count: number }> => {
  const offset = (page - 1) * pageSize;

  const whereClause: any = {};
  if (from && from !== 'undefined') {
    whereClause.createdAt = { ...whereClause.createdAt, [Op.gte]: new Date(from) };
  }
  if (to && to !== 'undefined') {
    whereClause.createdAt = { ...whereClause.createdAt, [Op.lte]: new Date(to) };
  }

  // Step 1: Get IDs and Count
  const { rows: idRows, count } = await db.Order.findAndCountAll({
    attributes: ['id'], // Fetch only IDs
    where: whereClause,
    include: [
      {
        model: db.OrderItem,
        as: 'orderItems',
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
    order: [['createdAt', 'DESC']],
  });

  if (count === 0) {
    return { rows: [], count: 0 };
  }

  const allOrderIds = idRows.map((row: any) => row.dataValues.id);
  // Manual Pagination
  const pagedOrderIds = allOrderIds.slice(offset, offset + pageSize);

  if (pagedOrderIds.length === 0) {
    return { rows: [], count };
  }

  // Step 2: Fetch Full Data
  const rows = await db.Order.findAll({
    where: {
      id: {
        [Op.in]: pagedOrderIds,
      },
    },
    include: [
      {
        model: db.User, // Alias is usually just 'User' unless specified
        attributes: ['name'],
      },
      {
        model: db.Payment, // Alias is usually just 'Payment'
        attributes: ['status'],
      },
      {
        model: db.OrderItem,
        as: 'orderItems',
        include: [
          {
            model: db.Product,
            where: { storeId },
            required: true,
          },
        ],
      },
    ],
    order: [['createdAt', 'DESC']],
  });

  // Step 3: Map to Frontend Interface
  const mappedRows = rows.map((order: any) => {
    const plainOrder = order.dataValues; // Get plain object from Sequelize instance

    // Calculate total price for the items in this store
    const totalPrice = plainOrder.orderItems.reduce((sum: number, item: any) => {
      // Use price from OrderItem (snapshot price)
      return sum + Number(item.dataValues.price) * item.dataValues.quantity;
    }, 0);

    return {
      id: plainOrder.id,
      paymentId: plainOrder.paymentId,
      customerName: plainOrder.User?.dataValues.name || 'Un',
      totalPrice: Number(totalPrice.toFixed(2)), // Ensure 2 decimal places
      status: plainOrder.Payment?.dataValues.status || 'Pe',
      createdAt: plainOrder.createdAt,
      updatedAt: plainOrder.updatedAt,
      orderItems: plainOrder.orderItems,
    };
  });

  return { rows: mappedRows, count };
};

export default {
  getLastOrder,
  getOrderItems,
  getOrdersByDateRange,
  getOrdersByStore,
};
