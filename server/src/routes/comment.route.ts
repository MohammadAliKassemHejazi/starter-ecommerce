import express from 'express';
import { getComments, addComment, updateComment, deleteComment } from '../controllers/comment.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = express.Router();

// GET /api/comments - Get comments for a product (public)
router.get('/', getComments);

// All other routes require authentication
router.use(verifyToken);

// POST /api/comments - Add comment
router.post('/', addComment);

// PUT /api/comments/:id - Update comment
router.put('/:id', updateComment);

// DELETE /api/comments/:id - Delete comment
router.delete('/:id', deleteComment);

export default router;
