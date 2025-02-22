import db from "../models";

export const getSalesData = async (): Promise<any> => {
  // Example query: Fetch total sales and monthly sales data
  const totalSales = await db.Order.sum("totalAmount", {
    where: { status: "completed" },
  });

  const monthlySales = await db.Order.findAll({
    attributes: [
      [db.Sequelize.fn("DATE_FORMAT", db.Sequelize.col("createdAt"), "%Y-%m"), "month"],
      [db.Sequelize.fn("SUM", db.Sequelize.col("totalAmount")), "amount"],
    ],
    where: { status: "completed" },
    group: ["month"],
    order: [["createdAt", "DESC"]],
  });

  return { totalSales: totalSales || 0, monthlySales };
};

export const getInventoryAlerts = async (): Promise<any[]> => {
  // Example query: Fetch products with quantity below a threshold
  const alerts = await db.Product.findAll({
    include: [
      {
        model: db.SizeItem,
        attributes: [],
        having: db.Sequelize.literal("quantity < threshold"),
      },
    ],
    attributes: ["id", "name", "threshold"],
    group: ["Product.id"],
  });

  return alerts.map((alert:any) => ({
    productId: alert.id,
    productName: alert.name,
    quantity: alert.SizeItems.reduce((sum:any, sizeItem:any) => sum + sizeItem.quantity, 0),
    threshold: alert.threshold,
  }));
};

export const getOrderStatuses = async (): Promise<any[]> => {
  // Example query: Fetch order counts by status
  const orderStatuses = await db.Order.findAll({
    attributes: [
      "status",
      [db.Sequelize.fn("COUNT", db.Sequelize.col("id")), "count"],
    ],
    group: ["status"],
  });

    return orderStatuses.map((status:any) => ({
    status: status.status,
    count: status.count,
  }));
};