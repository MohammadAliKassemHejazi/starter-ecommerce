import express from 'express';
import { trackEvent, getAnalytics, getEventStats } from '../controllers/analytics.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { checkPermission } from '../middlewares/permission.middleware';

const router = express.Router();

// Track event (public for frontend tracking)
router.post('/track', trackEvent);

// All other routes require authentication
router.use(verifyToken);

// Get analytics (admin only)
router.get('/', checkPermission('view_analytics'), getAnalytics);

// Get event statistics (admin only)
router.get('/stats', checkPermission('view_analytics'), getEventStats);

export default router;
