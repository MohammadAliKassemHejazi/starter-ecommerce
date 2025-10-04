import express from 'express';
import { packageController } from '../controllers/package.controller';
import { checkPermission } from '../middlewares/permission.middleware';
import { protectedRoutes } from "../middlewares";
const router = express.Router();

// Routes to protect
const Routes = ['/activate', '/', '/:id'];


protectedRoutes(router, Routes); 
/**
 * @swagger
 * /packages:
 *   get:
 *     summary: Get all packages
 *     tags: [Packages]
 *     responses:
 *       200:
 *         description: A list of packages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Package'
 *       500:
 *         description: Internal server error
 */
router.get('/', packageController.getAllPackages);

/**
 * @swagger
 * /packages/{id}:
 *   get:
 *     summary: Get a package by ID
 *     tags: [Packages]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the package to fetch
 *     responses:
 *       200:
 *         description: The package details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Package'
 *       404:
 *         description: Package not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', packageController.getPackageById);

/**
 * @swagger
 * /packages/activate:
 *   post:
 *     summary: Activate a package for the current user
 *     tags: [Packages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - packageId
 *             properties:
 *               packageId:
 *                 type: string
 *                 description: ID of the package to activate
 *     responses:
 *       200:
 *         description: Package activated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Package not found
 *       500:
 *         description: Internal server error
 */
router.post('/activate', packageController.activatePackage);

/**
 * @swagger
 * /packages:
 *   post:
 *     summary: Create a new package
 *     tags: [Packages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePackageRequest'
 *     responses:
 *       201:
 *         description: Package created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Package'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal server error
 */
router.post('/', checkPermission('manage_packages'), packageController.createPackage);

/**
 * @swagger
 * /packages/{id}:
 *   put:
 *     summary: Update a package
 *     tags: [Packages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the package to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePackageRequest'
 *     responses:
 *       200:
 *         description: Package updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Package'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Package not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', checkPermission('manage_packages'), packageController.updatePackage);

/**
 * @swagger
 * /packages/{id}:
 *   delete:
 *     summary: Delete a package
 *     tags: [Packages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the package to delete
 *     responses:
 *       200:
 *         description: Package deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Package not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', checkPermission('manage_packages'), packageController.deletePackage);

export default router;