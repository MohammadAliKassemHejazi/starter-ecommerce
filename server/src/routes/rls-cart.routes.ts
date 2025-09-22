import { Router } from "express";
import { body } from "express-validator";
import { backwardCompatibleTenantMiddleware } from "../middlewares/backward-compatible-tenant.middleware";
import rlsCartController from "../controllers/rls-cart.controller";

const router = Router();

// Apply backward-compatible tenant middleware to all routes
router.use(backwardCompatibleTenantMiddleware);

// Cart validation rules
const addToCartValidation = [
  body("productId").isUUID().withMessage("Product ID must be a valid UUID"),
  body("quantity").isInt({ min: 1 }).withMessage("Quantity must be a positive integer"),
  body("sizeId").optional().isUUID().withMessage("Size ID must be a valid UUID")
];

const removeFromCartValidation = [
  body("productId").isUUID().withMessage("Product ID must be a valid UUID"),
  body("sizeId").optional().isUUID().withMessage("Size ID must be a valid UUID")
];

// Routes
router.get(
  "/",
  rlsCartController.getCart
);

router.post(
  "/add",
  addToCartValidation,
  rlsCartController.addToCart
);

router.post(
  "/decrease",
  addToCartValidation,
  rlsCartController.decreaseCart
);

router.post(
  "/remove",
  removeFromCartValidation,
  rlsCartController.removeFromCart
);

router.delete(
  "/clear",
  rlsCartController.clearCart
);

export default router;
