import { Router } from "express";
import { body, param } from "express-validator";
import { backwardCompatibleTenantMiddleware } from "../middlewares/backward-compatible-tenant.middleware";
import rlsOrderController from "../controllers/rls-order.controller";

const router = Router();

// Apply backward-compatible tenant middleware to all routes
router.use(backwardCompatibleTenantMiddleware);

// Order validation rules
const createOrderValidation = [
  body("items").isArray().withMessage("Items must be an array"),
  body("items.*.productId").isUUID().withMessage("Product ID must be a valid UUID"),
  body("items.*.quantity").isInt({ min: 1 }).withMessage("Quantity must be a positive integer"),
  body("shippingAddress").notEmpty().withMessage("Shipping address is required"),
  body("paymentMethod").notEmpty().withMessage("Payment method is required")
];

const dateRangeValidation = [
  body("from").isISO8601().withMessage("From date must be a valid date"),
  body("to").isISO8601().withMessage("To date must be a valid date")
];

const updateStatusValidation = [
  body("status").isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage("Status must be one of: pending, processing, shipped, delivered, cancelled")
];

// Routes
router.get(
  "/last",
  rlsOrderController.getLastOrder
);

router.get(
  "/:orderId/items",
  param("orderId").isUUID().withMessage("Order ID must be a valid UUID"),
  rlsOrderController.getOrderItems
);

router.post(
  "/date-range",
  dateRangeValidation,
  rlsOrderController.getOrdersByDateRange
);

router.post(
  "/create",
  createOrderValidation,
  rlsOrderController.createOrder
);

router.put(
  "/:orderId/status",
  param("orderId").isUUID().withMessage("Order ID must be a valid UUID"),
  updateStatusValidation,
  rlsOrderController.updateOrderStatus
);

export default router;
