import { Router } from 'express';
import {
  handleFetchUsersByCreator,
  handleCreateUser,
  handleUpdateUser,
  handleDeleteUser,
  handleAssignRoleToUser,
  handleRemoveRoleFromUser,
} from '../controllers/user.controller';
import { protectedRoutes } from '../middlewares';

const router = Router();

// Define routes to protect
// We use "/:id" to cover both PUT and DELETE actions on a specific user, 
// and the specific sub-paths for role management.
const protectedRoutesList = [
  '/', 
  '/:id', 
  '/:userId/roles', 
  '/:userId/roles/:roleId'
];

protectedRoutes(router, protectedRoutesList);

/**
 * @swagger
 * /users?createdById=me:
 * get:
 * summary: Fetch users created by the authenticated user
 * tags: [Users]
 * security:
 * - bearerAuth: []
 */
router.get('/', handleFetchUsersByCreator);

/**
 * @swagger
 * /users:
 * post:
 * summary: Create a new user
 * tags: [Users]
 */
router.post('/', handleCreateUser);

/**
 * @swagger
 * /users/{id}:
 * put:
 * summary: Update a user by ID
 * tags: [Users]
 */
router.put('/:id', handleUpdateUser);

/**
 * @swagger
 * /users/{id}:
 * delete:
 * summary: Delete a user by ID
 * tags: [Users]
 */
router.delete('/:id', handleDeleteUser);

/**
 * @swagger
 * /users/{userId}/roles:
 * post:
 * summary: Assign a role to a user
 * tags: [Users]
 */
router.post('/:userId/roles', handleAssignRoleToUser);

/**
 * @swagger
 * /users/{userId}/roles/{roleId}:
 * delete:
 * summary: Remove a role from a user
 * tags: [Users]
 */
router.delete('/:userId/roles/:roleId', handleRemoveRoleFromUser);

export default router;