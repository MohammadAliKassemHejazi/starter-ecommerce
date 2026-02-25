import express from 'express';
import {
  getSizes,
  createSize,
  updateSize,
  deleteSize,
  getSizeItems,
  createSizeItem,
  updateSizeItem,
  deleteSizeItem,
} from '../controllers/size.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { checkPermission } from '../middlewares/permission.middleware';

const router = express.Router();

// Size routes (public for product display)
router.get('/', getSizes);

// Size Items routes
router.get('/items', getSizeItems);

// All other routes require authentication
router.use(verifyToken);

// Size management (admin/vendor)
router.post('/', checkPermission('manage_products'), createSize);
router.put('/:id', checkPermission('manage_products'), updateSize);
router.delete('/:id', checkPermission('manage_products'), deleteSize);

// Size Items management
router.post('/items', checkPermission('manage_products'), createSizeItem);
router.put('/items/:id', checkPermission('manage_products'), updateSizeItem);
router.delete('/items/:id', checkPermission('manage_products'), deleteSizeItem);

export default router;
