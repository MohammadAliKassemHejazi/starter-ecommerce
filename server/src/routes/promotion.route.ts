import express from 'express';
import { getPromotions, createPromotion, updatePromotion, deletePromotion, validatePromotionCode } from '../controllers/promotion.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { checkPermission } from '../middlewares/permission.middleware';

const router = express.Router();

// GET /api/promotions - Get all active promotions (public)
router.get('/', getPromotions);

// POST /api/promotions/validate - Validate promotion code (public)
router.post('/validate', validatePromotionCode);

// All other routes require authentication and admin permissions
router.use(verifyToken);
router.use(checkPermission('manage_promotions'));

// POST /api/promotions - Create promotion
router.post('/', createPromotion);

// PUT /api/promotions/:id - Update promotion
router.put('/:id', updatePromotion);

// DELETE /api/promotions/:id - Delete promotion
router.delete('/:id', deletePromotion);

export default router;
