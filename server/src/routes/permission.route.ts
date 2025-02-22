import { Router } from "express";
import {
  handleFetchPermissions,
  handleCreatePermission,
  handleUpdatePermission,
  handleDeletePermission,
  handleAddPermissionToRole,
  handleRemovePermissionFromRole,
} from "../controllers/permission.controller";
import { protectedRoutes } from "../middlewares";
import { body, param } from "express-validator";

const router = Router();

// Define routes to protect
const protectedRoutesList = [
  "/create",
  "/update/:id",
  "/delete/:id",
  "/:roleId/permissions",
  "/:roleId/permissions/:permissionId",
];
protectedRoutes(router, protectedRoutesList);

/**
 * @swagger
 * /permissions:
 *   get:
 *     summary: Fetch all permissions
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Permission'
 */
router.get("/", handleFetchPermissions);

/**
 * @swagger
 * /permissions:
 *   post:
 *     summary: Create a new permission
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePermissionRequest'
 *     responses:
 *       201:
 *         description: Permission created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Permission'
 *       400:
 *         description: Invalid input (missing or invalid fields)
 */
router.post(
  "/create",
  [body("name").isString().notEmpty().withMessage("Name is required")],
  handleCreatePermission
);

/**
 * @swagger
 * /permissions/{id}:
 *   put:
 *     summary: Update a permission by ID
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the permission to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePermissionRequest'
 *     responses:
 *       200:
 *         description: Permission updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Permission'
 *       400:
 *         description: Invalid input (missing or invalid fields)
 *       404:
 *         description: Permission not found
 */
router.put(
  "/update/:id",
  [
    param("id").isUUID().withMessage("Invalid UUID format"),
    body("name").isString().notEmpty().withMessage("Name is required"),
  ],
  handleUpdatePermission
);

/**
 * @swagger
 * /permissions/{id}:
 *   delete:
 *     summary: Delete a permission by ID
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the permission to delete
 *     responses:
 *       200:
 *         description: Permission deleted successfully
 *       404:
 *         description: Permission not found
 */
router.delete(
  "/delete/:id",
  [param("id").isUUID().withMessage("Invalid UUID format")],
  handleDeletePermission
);

/**
 * @swagger
 * /roles/{roleId}/permissions:
 *   post:
 *     summary: Add a permission to a role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: roleId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the role
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddPermissionToRoleRequest'
 *     responses:
 *       200:
 *         description: Permission added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RolePermission'
 *       400:
 *         description: Invalid input (missing or invalid fields)
 *       404:
 *         description: Role or permission not found
 */
router.post(
  "/:roleId/permissions",
  [
    param("roleId").isUUID().withMessage("Invalid role ID"),
    body("permissionId").isUUID().withMessage("Invalid permission ID"),
  ],
  handleAddPermissionToRole
);

/**
 * @swagger
 * /roles/{roleId}/permissions/{permissionId}:
 *   delete:
 *     summary: Remove a permission from a role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: roleId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the role
 *       - name: permissionId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the permission to remove
 *     responses:
 *       200:
 *         description: Permission removed successfully
 *       404:
 *         description: Role or permission not found
 */
router.delete(
  "/:roleId/permissions/:permissionId",
  [
    param("roleId").isUUID().withMessage("Invalid role ID"),
    param("permissionId").isUUID().withMessage("Invalid permission ID"),
  ],
  handleRemovePermissionFromRole
);

export default router;