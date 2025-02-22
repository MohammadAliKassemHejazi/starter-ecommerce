import { CustomErrorParams } from "../customError";

export const SalesDataFetchFailure: CustomErrorParams = {
  message: "Failed to fetch sales data.",
  code: "DASHBOARD001",
  statusCode: 500,
};

export const InventoryAlertsFetchFailure: CustomErrorParams = {
  message: "Failed to fetch inventory alerts.",
  code: "DASHBOARD002",
  statusCode: 500,
};

export const OrderStatusesFetchFailure: CustomErrorParams = {
  message: "Failed to fetch order statuses.",
  code: "DASHBOARD003",
  statusCode: 500,
};

export default {
  SalesDataFetchFailure,
  InventoryAlertsFetchFailure,
  OrderStatusesFetchFailure,
};