import express from 'express';
import { trackEvent, getAnalytics, getEventStats } from '../controllers/analytics.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { checkPermission } from '../middlewares/permission.middleware';
import { backwardCompatibleTenantMiddleware } from '../middlewares/backward-compatible-tenant.middleware';

const router = express.Router();

// Track event (public for frontend tracking)
router.post('/track', backwardCompatibleTenantMiddleware, trackEvent);

// All other routes require authentication and RLS tenant isolation
router.use(verifyToken);
router.use(backwardCompatibleTenantMiddleware);

// Get analytics (admin only) - now tenant-specific
router.get('/', checkPermission('view_analytics'), getAnalytics);

// Get event statistics (admin only) - now tenant-specific
router.get('/stats', checkPermission('view_analytics'), getEventStats);

export default router;
