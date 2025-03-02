import db from "../models";

export const getSalesData = async (): Promise<any> => {
  // Fetch total sales (completed payments)
  const totalSales = await db.Payment.sum("amount", {
    where: { status: "succeeded" },
    include: [
      {
        model: db.Order,
        required: true, // Only include orders with successful payments
      },
    ],
  });

  // Fetch monthly sales data
  const monthlySales = await db.Payment.findAll({
    attributes: [
      [db.Sequelize.fn("DATE_FORMAT", db.Sequelize.col("createdAt"), "%Y-%m"), "month"],
      [db.Sequelize.fn("SUM", db.Sequelize.col("amount")), "totalAmount"],
    ],
    where: { status: "succeeded" }, // Filter by successful payments
    include: [
      {
        model: db.Order,
        required: true, // Only include orders with successful payments
      },
    ],
    group: ["month"], // Group by the computed 'month' field
    order: [["createdAt", "DESC"]], // Order by createdAt in descending order
    raw: true, // Use raw query to simplify result format
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
        attributes: ["id", "name"], // Include product details
        required: true, // Only include products with size items
      },
    ],
    where: db.Sequelize.literal("`SizeItem.quantity` < `Product.discount`"), // Use discount as threshold
    group: ["Product.id"], // Group by product ID
    raw: true, // Use raw query to simplify result format
  });

  return alerts.map((alert: any) => ({
    productId: alert.productId,
    productName: alert.name,
    quantity: alert.quantity,
    threshold: alert.discount, // Use discount as threshold
  }));
};

export const getOrderStatuses = async (): Promise<any[]> => {
  const orderStatuses = await db.Order.findAll({
    attributes: ["id"],
    include: [
      {
        model: db.Payment,
        attributes: ["status"],
        required: true, // Include only orders with associated payments
      },
      {
        model: db.OrderShipping,
        attributes: ["status"],
        required: false, // Optional: Include shipping status if available
      },
    ],
    group: ["Payment.status", "OrderShipping.status"], // Group by payment and shipping statuses
    raw: true, // Use raw query to simplify result format
  });

  return orderStatuses.map((order: any) => ({
    orderId: order.id,
    paymentStatus: order["Payment.status"],
    shippingStatus: order["OrderShipping.status"] || "Not Shipped", // Default if no shipping info
  }));
};