import express from 'express';
import {
  getShippingMethods,
  createShippingMethod,
  updateShippingMethod,
  deleteShippingMethod,
  getOrderShippings,
  createOrderShipping,
  updateOrderShippingStatus,
} from '../controllers/shipping.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { checkPermission } from '../middlewares/permission.middleware';

const router = express.Router();

// Shipping Methods routes
router.get('/methods', getShippingMethods);

// Order Shipping routes
router.get('/orders', verifyToken, checkPermission('view_orders'), getOrderShippings);
router.post('/orders', verifyToken, checkPermission('manage_orders'), createOrderShipping);
router.put('/orders/:id/status', verifyToken, checkPermission('manage_orders'), updateOrderShippingStatus);

// Admin routes for shipping methods
router.use(verifyToken);
router.use(checkPermission('manage_shipping'));

router.post('/methods', createShippingMethod);
router.put('/methods/:id', updateShippingMethod);
router.delete('/methods/:id', deleteShippingMethod);

export default router;
