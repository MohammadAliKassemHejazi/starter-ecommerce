import { Router } from "express";
import { body, param } from "express-validator";
import { backwardCompatibleTenantMiddleware } from "../middlewares/backward-compatible-tenant.middleware";
import rlsStoreController from "../controllers/rls-store.controller";

const router = Router();

// Apply backward-compatible tenant middleware to all routes
router.use(backwardCompatibleTenantMiddleware);

// Store validation rules
const storeValidation = [
  body("name").notEmpty().withMessage("Store name is required"),
  body("description").optional().isString().withMessage("Description must be a string"),
  body("categoryId").isUUID().withMessage("Category ID must be a valid UUID")
];

// Routes
router.post(
  "/create",
  storeValidation,
  rlsStoreController.handleCreateStore
);

router.get(
  "/all",
  rlsStoreController.handleGetStores
);

router.get(
  "/:id",
  param("id").isUUID().withMessage("Store ID must be a valid UUID"),
  rlsStoreController.handleGetStoreById
);

router.put(
  "/:id",
  param("id").isUUID().withMessage("Store ID must be a valid UUID"),
  storeValidation,
  rlsStoreController.handleUpdateStore
);

router.delete(
  "/:id",
  param("id").isUUID().withMessage("Store ID must be a valid UUID"),
  rlsStoreController.handleDeleteStore
);

export default router;
