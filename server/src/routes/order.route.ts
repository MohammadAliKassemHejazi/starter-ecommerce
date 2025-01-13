import express from "express";
import orderController from "../controllers/order.controller";
import { protectedRoutes } from "../middlewares";

const router = express.Router();

const Routes = [
  "/create",
  "/:orderId",
  "/user",
  "/date-range",
];

// Protect all order routes
protectedRoutes(router, Routes);

// Create a new order
router.post("/create", orderController.createOrder);

// Get order by ID
router.get("/:orderId", orderController.getOrderById);

// Get all orders for the logged-in user
router.get("/user", orderController.getOrdersByUser);

// Get orders within a date range
router.get("/date-range", orderController.getOrdersByDateRange);

export default router;