import { Request, Response } from 'express';
import db from '../models';
import customError from '../utils/customError';

export const getFavorites = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).UserId;
    
    const favorites = await db.Favorite.findAll({
      where: { userId },
      include: [
        {
          model: db.Product,
          include: [
            {
              model: db.ProductImage,
              attributes: ['imageUrl']
            }
          ]
        }
      ]
    });

    res.status(200).json({
      success: true,
      data: favorites
    });
  } catch (error) {
    console.error('Error getting favorites:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get favorites'
    });
  }
};

export const addToFavorites = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).UserId;
    const { productId } = req.body;

    // Check if product exists
    const product = await db.Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if already in favorites
    const existingFavorite = await db.Favorite.findOne({
      where: { userId, productId }
    });

    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: 'Product already in favorites'
      });
    }

    const favorite = await db.Favorite.create({
      userId,
      productId
    });

    res.status(201).json({
      success: true,
      data: favorite,
      message: 'Product added to favorites'
    });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add to favorites'
    });
  }
};

export const removeFromFavorites = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).UserId;
    const { productId } = req.params;

    const favorite = await db.Favorite.findOne({
      where: { userId, productId }
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Favorite not found'
      });
    }

    await favorite.destroy();

    res.status(200).json({
      success: true,
      message: 'Product removed from favorites'
    });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove from favorites'
    });
  }
};
