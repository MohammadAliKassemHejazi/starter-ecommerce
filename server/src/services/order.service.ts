import { IOrderItemAttributes } from "interfaces/types/models/orderitem.model.types";
import { IOrderAttributes } from "../interfaces/types/models/order.model.types";
import db from "../models";
import customError from "../utils/customError";
import orderErrors from "../utils/errors/order.errors";
import { Op } from "sequelize";
import { raw } from "body-parser";

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

  const replacements: Record<string, any> = { storeId };
  let whereConditions = 'WHERE "p"."storeId" = :storeId';

  if (from && from !== 'undefined') {
    const fromDate = new Date(from);
    replacements.from = fromDate;
    whereConditions += ' AND "Order"."createdAt" >= :from';
  }
  if (to && to !== 'undefined') {
    const toDate = new Date(to);
    replacements.to = toDate;
    whereConditions += ' AND "Order"."createdAt" <= :to';
  }

  // 🔢 Step 1: Count
  const countResult = await db.sequelize.query(
    `
      SELECT COUNT(DISTINCT "Order"."id") AS count
      FROM "Orders" AS "Order"
      INNER JOIN "OrderItems" AS "oi" ON "Order"."id" = "oi"."orderId"
      INNER JOIN "Products" AS "p" ON "oi"."productId" = "p"."id"
      ${whereConditions}
    `,
    {
      type: db.sequelize.QueryTypes.SELECT,
      replacements,
    }
  );
  const count = parseInt(countResult[0].count, 10);

<<<<<<< HEAD
=======
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
    order: [["createdAt", "DESC"]],
  });

  // Step 2: Fetch Full Data if any IDs found
>>>>>>> 7d4cc542a7df2ef3cc02253d16b8298f18745fd6
  if (count === 0) {
    return { rows: [], count: 0 };
  }

<<<<<<< HEAD
  // 📋 Step 2: Get IDs with createdAt (required for ORDER BY + DISTINCT)
  const idRows = await db.sequelize.query(
    `
      SELECT DISTINCT "Order"."id", "Order"."createdAt"
      FROM "Orders" AS "Order"
      INNER JOIN "OrderItems" AS "oi" ON "Order"."id" = "oi"."orderId"
      INNER JOIN "Products" AS "p" ON "oi"."productId" = "p"."id"
      ${whereConditions}
      ORDER BY "Order"."createdAt" DESC
      LIMIT :limit OFFSET :offset
    `,
    {
      type: db.sequelize.QueryTypes.SELECT,
      replacements: {
        ...replacements,
        limit: pageSize,
        offset,
      },
    }
  );

  const orderIds = idRows.map((row: any) => row.id);

  if (orderIds.length === 0) {
    return { rows: [], count };
  }
=======
  const allOrderIds = idRows.map((row: any) => row.id);
  // Manual Pagination
  const pagedOrderIds = allOrderIds.slice(offset, offset + pageSize);

  if (pagedOrderIds.length === 0) {
    return { rows: [], count };
  }

  const rows = await db.Order.findAll({
    where: {
      id: {
        [Op.in]: pagedOrderIds,
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
>>>>>>> 7d4cc542a7df2ef3cc02253d16b8298f18745fd6

  // 🧾 Step 3: Fetch full orders
// Sequelize v6+ supports `plain: true` in options
const rows = await db.Order.findAll({
  where: {
    id: { [Op.in]: orderIds },
  },
  include: [
    {
      model: db.OrderItem,
      as: 'orderItems',
      include: [{ model: db.Product }],
    },
  ],
  order: [['createdAt', 'DESC']],
  plain: false, // ← this is default; don't set raw: true
});

// Then convert to plain objects if needed:
  const plainRows = rows.map((row: { toJSON: () => any; }) => row.toJSON());

  return { rows: plainRows, count };
};

export default {
  getLastOrder,
  getOrderItems,
  getOrdersByDateRange,
  getOrdersByStore,
};
