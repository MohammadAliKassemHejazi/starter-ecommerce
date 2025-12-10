import { Request, Response } from 'express';
import db from '../models';
import customError from '../utils/customError';

export const getComments = async (req: Request, res: Response) => {
  try {
    const { productId } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.limit as string) || 5;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    const { count, rows: comments } = await db.Comment.findAndCountAll({
      where: { productId },
      include: [
        {
          model: db.User,
          attributes: ['id', 'name']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });

    res.status(200).json({
      success: true,
      data: {
        items: comments,
        total: count,
        page,
        pageSize
      }
    });
  } catch (error) {
    console.error('Error getting comments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get comments'
    });
  }
};

export const addComment = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).UserId;
    const { productId, text, rating } = req.body;

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Check if product exists
    const product = await db.Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const comment = await db.Comment.create({
      userId,
      productId,
      text,
      rating
    });

    // Fetch the comment with user details
    const commentWithUser = await db.Comment.findByPk(comment.id, {
      include: [
        {
          model: db.User,
          attributes: ['id', 'name']
        }
      ]
    });

    res.status(201).json({
      success: true,
      data: commentWithUser,
      message: 'Comment added successfully'
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add comment'
    });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).UserId;
    const { id } = req.params;
    const { text, rating } = req.body;

    const comment = await db.Comment.findOne({
      where: { id, userId }
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found or you do not have permission to edit it'
      });
    }

    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    await comment.update({ text, rating });

    res.status(200).json({
      success: true,
      message: 'Comment updated successfully'
    });
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update comment'
    });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).UserId;
    const { id } = req.params;

    const comment = await db.Comment.findOne({
      where: { id, userId }
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found or you do not have permission to delete it'
      });
    }

    await comment.destroy();

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete comment'
    });
  }
};
