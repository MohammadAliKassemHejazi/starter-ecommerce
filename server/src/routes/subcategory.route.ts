import { Router } from 'express';
import {
  handleFetchSubCategories,
  handleCreateSubCategory,
  handleUpdateSubCategory,
  handleDeleteSubCategory,
} from '../controllers/subcategory.controller';
import { protectedRoutes } from '../middlewares';

const router = Router();

// Define routes to protect
const protectedRoutesList = ['/', '/create', '/update/:id', '/delete/:id'];
protectedRoutes(router, protectedRoutesList);

/**
 * @swagger
 * /subcategories:
 *   get:
 *     summary: Fetch all subcategories
 *     tags: [SubCategories]
 *     responses:
 *       200:
 *         description: A list of subcategories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SubCategory'
 */
router.get('/', handleFetchSubCategories);

/**
 * @swagger
 * /subcategories:
 *   post:
 *     summary: Create a new subcategory
 *     tags: [SubCategories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSubCategoryRequest'
 *     responses:
 *       201:
 *         description: Subcategory created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubCategory'
 *       400:
 *         description: Invalid input (missing or invalid fields)
 *       401:
 *         description: Unauthorized (missing or invalid token)
 */
router.post('/', handleCreateSubCategory);

/**
 * @swagger
 * /subcategories/{id}:
 *   put:
 *     summary: Update a subcategory by ID
 *     tags: [SubCategories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the subcategory to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateSubCategoryRequest'
 *     responses:
 *       200:
 *         description: Subcategory updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubCategory'
 *       400:
 *         description: Invalid input (missing or invalid fields)
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       404:
 *         description: Subcategory not found
 */
router.put('/:id', handleUpdateSubCategory);

/**
 * @swagger
 * /subcategories/{id}:
 *   delete:
 *     summary: Delete a subcategory by ID
 *     tags: [SubCategories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the subcategory to delete
 *     responses:
 *       200:
 *         description: Subcategory deleted successfully
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       404:
 *         description: Subcategory not found
 */
router.delete('/:id', handleDeleteSubCategory);

export default router;
