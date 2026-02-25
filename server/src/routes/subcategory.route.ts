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
// Note: We use the full path strings as they appear in the router definitions below
const protectedRoutesList = ['/', '/create', '/update/:id', '/delete/:id'];
protectedRoutes(router, protectedRoutesList);

/**
 * @swagger
 * /subcategories:
 * get:
 * summary: Fetch all subcategories
 * tags: [SubCategories]
 * responses:
 * 200:
 * description: A list of subcategories
 */
router.get('/', handleFetchSubCategories);

/**
 * @swagger
 * /subcategories:
 * post:
 * summary: Create a new subcategory
 * tags: [SubCategories]
 */
router.post('/', handleCreateSubCategory);

/**
 * @swagger
 * /subcategories/update/{id}:
 * put:
 * summary: Update a subcategory by ID
 * tags: [SubCategories]
 */
router.put("/update/:id", handleUpdateSubCategory);

/**
 * @swagger
 * /subcategories/delete/{id}:
 * delete:
 * summary: Delete a subcategory by ID
 * tags: [SubCategories]
 */
router.delete("/delete/:id", handleDeleteSubCategory);

export default router;