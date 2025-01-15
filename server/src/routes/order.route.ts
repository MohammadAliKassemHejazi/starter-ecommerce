import express from "express";
import orderController from "../controllers/order.controller";
import { protectedRoutes } from "../middlewares";

const router = express.Router();

const Routes = [
  "/last",
  "/:orderId/items",
  "/date-range",
];

// Protect all order routes
protectedRoutes(router, Routes);

// Get the last order for the logged-in user
router.get("/last", orderController.getLastOrder);

// Get order items by order ID
router.get("/:orderId/items", orderController.getOrderItems);

// Get orders within a date range
router.post("/date-range", orderController.getOrdersByDateRange);

export default router;