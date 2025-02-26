import { Router } from "express";
import {
  handleGetSalesData,
  handleGetInventoryAlerts,
  handleGetOrderStatuses,
} from "../controllers/dashboard.controller";
import { protectedRoutes } from "../middlewares";

const router = Router();

// Define routes to protect
const protectedRoutesList = ["/sales", "/alerts", "/orders/status"];
protectedRoutes(router, protectedRoutesList);

/**
 * @swagger
 * /api/sales:
 *   get:
 *     summary: Get sales data
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sales data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalSales:
 *                   type: number
 *                 monthlySales:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                       amount:
 *                         type: number
 */
router.get("/sales", handleGetSalesData);

/**
 * @swagger
 * /api/inventory/alerts:
 *   get:
 *     summary: Get inventory alerts
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Inventory alerts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   productId:
 *                     type: string
 *                   productName:
 *                     type: string
 *                   quantity:
 *                     type: integer
 *                   threshold:
 *                     type: integer
 */
router.get("/inventory/alerts", handleGetInventoryAlerts);

/**
 * @swagger
 * /api/orders/status:
 *   get:
 *     summary: Get order statuses
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Order statuses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                   count:
 *                     type: integer
 */
router.get("/orders/status", handleGetOrderStatuses);

export default router;