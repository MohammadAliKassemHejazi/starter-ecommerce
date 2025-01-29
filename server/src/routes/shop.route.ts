import express from "express";
import { shopController } from "../controllers/index";
import { protectedRoutes } from "../middlewares";
import { body, param, query, validationResult } from "express-validator";

const router = express.Router();

const Routes = [
  "/create",
  "/update",
  "/getall",
  "/get/storeProducts/:storeId",
  "/delete/:id",
];

// Apply protectedRoutes middleware
protectedRoutes(router, Routes);

// Create Product (with validation and sanitization)
router.post(
  "/create",
  [
    body("name").trim().notEmpty().escape(), // Validate and sanitize name
    body("description").trim().escape(), // Sanitize description
    body("price").isFloat({ min: 0 }).toFloat(), // Validate price
    body("sizes").isArray(), // Validate sizes
  ],
  shopController.handleCreateProduct
);

// Update Product (with validation and sanitization)
router.post(
  "/update",
  [
    body("id").isInt().toInt(), // Validate ID
    body("name").trim().notEmpty().escape(), // Validate and sanitize name
    body("description").trim().escape(), // Sanitize description
    body("price").isFloat({ min: 0 }).toFloat(), // Validate price
  ],
  shopController.handleUpdate
);

// Get Single Item (with validation)
router.get(
  "/get",
  [query("id").isString().trim().notEmpty().escape()], // Validate and sanitize ID
  shopController.handleGetSingleItem
);

// Get All Products
router.get("/getall", shopController.handelgetall);

// Get Products Listing (with validation)
router.get(
  "/get/productListing",
  [
    query("page").optional().isInt({ min: 1 }).toInt(), // Validate page
    query("pageSize").optional().isInt({ min: 1 }).toInt(), // Validate pageSize
  ],
  shopController.getProductsListing
);

// Get Products by Store (with validation)
router.get(
  "/get/storeProducts/:storeId",
  [
    param("storeId").isString().trim().notEmpty().escape(), // Validate storeId
    query("page").optional().isInt({ min: 1 }).toInt(), // Validate page
    query("pageSize").optional().isInt({ min: 1 }).toInt(),// Validate pageSize
    param("searchQuery").isString().trim().optional(), // Validate search
  ],
  shopController.getProductsByStore
);

// Delete Product (with validation)
router.delete(
  "/delete/:id",
  [param("id").isString().trim().notEmpty().escape()], // Validate ID
  shopController.handleDelete
);

// Delete Image (with validation)
router.delete(
  "/delete/image/:id",
  [param("id").isString().trim().notEmpty().escape()], // Validate ID
  shopController.handleDeleteImage
);

export default router;