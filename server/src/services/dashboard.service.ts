import { response } from "express";
import db from "../models";

export const getSalesData = async (userIds: string[]): Promise<any> => {
  const totalSales = await db.Payment.sum("amount", {
    where: { status: "succeeded" },
    include: [
      {
        model: db.Order,
        required: true,
        where: { userId: { [db.Sequelize.Op.in]: userIds } },
        attributes: [],
      },
    ],
  });

  const monthlySales = await db.Payment.findAll({
    attributes: [
      [db.sequelize.fn("to_char", db.sequelize.col("Payment.createdAt"), "YYYY-MM"), "month"],
      [db.sequelize.fn("SUM", db.sequelize.col("amount")), "totalAmount"],
    ],
    where: { status: "succeeded" },
    include: [
      {
        model: db.Order,
        required: true,
        where: { userId: { [db.Sequelize.Op.in]: userIds } },
        attributes: [],
      },
    ],
    group: [db.sequelize.fn("to_char", db.sequelize.col("Payment.createdAt"), "YYYY-MM")],
    order: [[db.sequelize.col("month"), "DESC"]],
    raw: true,
  });

  return {
    totalSales: parseFloat(totalSales) || 0,
    monthlySales: monthlySales.map((item: any) => ({
      month: item.month,
      totalAmount: parseFloat(item.totalAmount) || 0,
    })),
  };
};

export const getInventoryAlerts = async (userIds: string[]): Promise<any[]> => {
  const THRESHOLD = 5;

  // Assuming: SizeItem → Product → Store → User
  const alerts = await db.SizeItem.findAll({
    include: [
      {
        model: db.Product,
        required: true,
        include: [
          {
            model: db.Store,
            required: true,
            where: { userId: { [db.Sequelize.Op.in]: userIds } },
            attributes: [],
          }
        ],
        attributes: ['id', 'name'],
      },
      { model: db.Size, attributes: ['size'] },
    ],
    where: { quantity: { [db.Sequelize.Op.lt]: THRESHOLD } },
    raw: true,
  });

  return alerts.map((alert: any) => ({
    productId: alert["Product.id"],
    productName: alert["Product.name"],
    size: alert["Size.size"],
    quantity: alert.quantity,
    threshold: THRESHOLD,
  }));
};


export const getOrderStatuses = async (userIds: string[]): Promise<any[]> => {
  const orderStatuses = await db.Order.findAll({
    where: { userId: { [db.Sequelize.Op.in]: userIds } },
    attributes: ["id"],
    include: [
      {
        model: db.Payment,
        attributes: ["status"],
        required: true,
      },
      {
        model: db.OrderShipping,
        as: 'shippingDetails',
        attributes: ["status"],
        required: false,
      },
    ],
    raw: true,
  });

  return orderStatuses.map((order: any) => ({
    orderId: order.id,
    paymentStatus: order["Payment.status"],
    shippingStatus: order["OrderShippings.status"] || "Not Shipped",
  }));
};



