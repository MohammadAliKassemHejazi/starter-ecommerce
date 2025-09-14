import express from 'express';
import { getReturns, createReturnRequest, updateReturnStatus, getReturnById, deleteReturnRequest } from '../controllers/return.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { checkPermission } from '../middlewares/permission.middleware';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Get returns (admin can see all, users see their own)
router.get('/', getReturns);

// Create return request
router.post('/', createReturnRequest);

// Get return by ID
router.get('/:id', getReturnById);

// Update return status (admin only)
router.put('/:id/status', checkPermission('manage_returns'), updateReturnStatus);

// Delete return request (admin only)
router.delete('/:id', checkPermission('manage_returns'), deleteReturnRequest);

export default router;
