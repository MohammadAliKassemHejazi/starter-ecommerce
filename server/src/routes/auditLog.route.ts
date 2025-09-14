import express from 'express';
import { getAuditLogs, getAuditLogById, getAuditStats } from '../controllers/auditLog.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { checkPermission } from '../middlewares/permission.middleware';

const router = express.Router();

// All routes require authentication and admin permissions
router.use(verifyToken);
router.use(checkPermission('view_audit_logs'));

// Get audit logs
router.get('/', getAuditLogs);

// Get audit log by ID
router.get('/:id', getAuditLogById);

// Get audit statistics
router.get('/stats/overview', getAuditStats);

export default router;
