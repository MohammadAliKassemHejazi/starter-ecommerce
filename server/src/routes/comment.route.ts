import express from 'express';
import { getComments, addComment, updateComment, deleteComment } from '../controllers/comment.controller';
import { protectedRoutes } from '../middlewares/protectedRoutes.middleware';

const router = express.Router();
const Routes = [
  "/add",
  "/:id",
];

// Apply protectedRoutes middleware
protectedRoutes(router, Routes);
// GET /api/comments - Get comments for a product (public)
router.get('/', getComments);



// POST /api/comments - Add comment
router.post('/add', addComment);

// PUT /api/comments/:id - Update comment
router.put('/:id', updateComment);

// DELETE /api/comments/:id - Delete comment
router.delete('/:id', deleteComment);

export default router;
