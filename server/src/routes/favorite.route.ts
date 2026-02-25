import express from 'express';
import { getFavorites, addToFavorites, removeFromFavorites } from '../controllers/favorite.controller';

import { protectedRoutes } from '../middlewares';

const router = express.Router();

const protectedRoutesList = ['/', '/:id'];

// Apply protection to specified routes
protectedRoutes(router, protectedRoutesList);
// All routes require authentication

// GET /api/favorites - Get user's favorites
router.get('/', getFavorites);

// POST /api/favorites - Add product to favorites
router.post('/', addToFavorites);

// DELETE /api/favorites/:productId - Remove product from favorites
router.delete('/:id', removeFromFavorites);

export default router;
