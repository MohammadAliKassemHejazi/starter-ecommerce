import db from "../models";

export const getSalesData = async (): Promise<any> => {
  // Fetch total sales (completed payments)
  const totalSales = await db.Payment.sum("amount", {
    where: { status: "succeeded" },
    include: [
      {
        model: db.Order,
        required: true,
        attributes: [],
      },
    ],
  });

  // Fetch monthly sales data
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
        attributes: [],
      },
    ],
    group: [db.sequelize.fn("to_char", db.sequelize.col("Payment.createdAt"), "YYYY-MM")],
    order: [[db.sequelize.col("month"), "DESC"]], // Order by the aliased month column
    raw: true,
  });

return {
  totalSales: totalSales || 0,
  monthlySales: monthlySales.map((item: any) => ({
    month: item.month,
    totalAmount: item.totalAmount,
  })),
};
};

export const getInventoryAlerts = async (): Promise<any[]> => {
  const alerts = await db.SizeItem.findAll({
    include: [
      {
        model: db.Product,
        attributes: ["id", "name", "discount"], // Include discount for verification
        required: true,
      },
    ],
    where: db.sequelize.literal('"SizeItem"."quantity" < "Product"."discount"'),
    raw: true,
  });

  return alerts.map((alert: any) => ({
    productId: alert["Product.id"],
    productName: alert["Product.name"],
    quantity: alert.quantity,
    threshold: alert["Product.discount"],
  }));
};

export const getOrderStatuses = async (): Promise<any[]> => {
  const orderStatuses = await db.Order.findAll({
    attributes: ["id"],
    include: [
      {
        model: db.Payment,
        attributes: ["status"],
        required: true,
      },
      {
        model: db.OrderShipping,
        attributes: ["status"],
        required: false,
      },
    ],
    // group: ["Payment.status", "OrderShippings.status"], // Changed to plural alias
    group: ["Order.id", "Payment.status", "OrderShippings.status"],
    raw: true,
  });

  return orderStatuses.map((order: any) => ({
    orderId: order.id,
    paymentStatus: order["Payment.status"],
    shippingStatus: order["OrderShippings.status"] || "Not Shipped",
  }));
};