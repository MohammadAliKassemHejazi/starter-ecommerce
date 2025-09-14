import express from 'express';
import { 
  getUserSessions, createUserSession, updateUserSession, deleteUserSession,
  getActiveSessions, terminateAllSessions
} from '../controllers/userSession.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { checkPermission } from '../middlewares/permission.middleware';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Get user sessions
router.get('/', checkPermission('view_user_sessions'), getUserSessions);

// Create user session (when user logs in)
router.post('/', createUserSession);

// Update user session (when user logs out)
router.put('/:id', updateUserSession);

// Delete user session
router.delete('/:id', checkPermission('manage_user_sessions'), deleteUserSession);

// Get active sessions for a user
router.get('/user/:userId/active', checkPermission('view_user_sessions'), getActiveSessions);

// Terminate all sessions for a user
router.post('/user/:userId/terminate-all', checkPermission('manage_user_sessions'), terminateAllSessions);

export default router;
