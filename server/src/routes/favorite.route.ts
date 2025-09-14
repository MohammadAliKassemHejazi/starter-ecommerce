import express from 'express';
import { getFavorites, addToFavorites, removeFromFavorites } from '../controllers/favorite.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// GET /api/favorites - Get user's favorites
router.get('/', getFavorites);

// POST /api/favorites - Add product to favorites
router.post('/', addToFavorites);

// DELETE /api/favorites/:productId - Remove product from favorites
router.delete('/:productId', removeFromFavorites);

export default router;
