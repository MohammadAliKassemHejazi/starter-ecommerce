import { Router } from "express";
import { body, param, query } from "express-validator";
import { backwardCompatibleTenantMiddleware } from "../middlewares/backward-compatible-tenant.middleware";
import rlsShopController from "../controllers/rls-shop.controller";

const router = Router();

// Apply backward-compatible tenant middleware to all routes
router.use(backwardCompatibleTenantMiddleware);

// Product validation rules
const productValidation = [
  body("name").notEmpty().withMessage("Product name is required"),
  body("description").notEmpty().withMessage("Product description is required"),
  body("price").isNumeric().withMessage("Price must be a number"),
  body("categoryId").isUUID().withMessage("Category ID must be a valid UUID"),
  body("subcategoryId").isUUID().withMessage("Subcategory ID must be a valid UUID"),
  body("storeId").isUUID().withMessage("Store ID must be a valid UUID"),
  body("sizes").isString().withMessage("Sizes must be a JSON string")
];

const updateValidation = [
  body("productID").isUUID().withMessage("Product ID must be a valid UUID"),
  ...productValidation
];

// Routes
router.post(
  "/create",
  productValidation,
  rlsShopController.handleCreateProduct
);

router.put(
  "/update",
  updateValidation,
  rlsShopController.handleUpdate
);

router.delete(
  "/delete/:id",
  param("id").isUUID().withMessage("Product ID must be a valid UUID"),
  rlsShopController.handleDelete
);

router.get(
  "/all",
  rlsShopController.handelgetall
);

router.get(
  "/single",
  query("id").isUUID().withMessage("Product ID must be a valid UUID"),
  rlsShopController.handleGetSingleItem
);

router.get(
  "/store/:storeId",
  param("storeId").isUUID().withMessage("Store ID must be a valid UUID"),
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
  query("pageSize").optional().isInt({ min: 1, max: 100 }).withMessage("Page size must be between 1 and 100"),
  rlsShopController.getProductsByStore
);

router.get(
  "/listing",
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
  query("pageSize").optional().isInt({ min: 1, max: 100 }).withMessage("Page size must be between 1 and 100"),
  rlsShopController.getProductsListing
);

export default router;
