import { Request, Response } from 'express';
import db from '../models';
import customError from '../utils/customError';

export const getPromotions = async (req: Request, res: Response) => {
  try {
    const promotions = await db.Promotion.findAll({
      where: {
        validFrom: { [db.Sequelize.Op.lte]: new Date() },
        validTo: { [db.Sequelize.Op.gte]: new Date() }
      },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: promotions
    });
  } catch (error) {
    console.error('Error getting promotions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get promotions'
    });
  }
};

export const createPromotion = async (req: Request, res: Response) => {
  try {
    const { code, type, value, minCartValue, validFrom, validTo } = req.body;

    // Check if code already exists
    const existingPromotion = await db.Promotion.findOne({
      where: { code }
    });

    if (existingPromotion) {
      return res.status(400).json({
        success: false,
        message: 'Promotion code already exists'
      });
    }

    const promotion = await db.Promotion.create({
      code,
      type,
      value,
      minCartValue,
      validFrom: validFrom ? new Date(validFrom) : new Date(),
      validTo: validTo ? new Date(validTo) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    });

    res.status(201).json({
      success: true,
      data: promotion,
      message: 'Promotion created successfully'
    });
  } catch (error) {
    console.error('Error creating promotion:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create promotion'
    });
  }
};

export const updatePromotion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const promotion = await db.Promotion.findByPk(id);

    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Promotion not found'
      });
    }

    // If updating code, check for duplicates
    if (updateData.code && updateData.code !== promotion.code) {
      const existingPromotion = await db.Promotion.findOne({
        where: { code: updateData.code }
      });

      if (existingPromotion) {
        return res.status(400).json({
          success: false,
          message: 'Promotion code already exists'
        });
      }
    }

    await promotion.update(updateData);

    res.status(200).json({
      success: true,
      data: promotion,
      message: 'Promotion updated successfully'
    });
  } catch (error) {
    console.error('Error updating promotion:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update promotion'
    });
  }
};

export const deletePromotion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const promotion = await db.Promotion.findByPk(id);

    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Promotion not found'
      });
    }

    await promotion.destroy();

    res.status(200).json({
      success: true,
      message: 'Promotion deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting promotion:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete promotion'
    });
  }
};

export const validatePromotionCode = async (req: Request, res: Response) => {
  try {
    const { code, cartValue } = req.body;

    const promotion = await db.Promotion.findOne({
      where: {
        code,
        validFrom: { [db.Sequelize.Op.lte]: new Date() },
        validTo: { [db.Sequelize.Op.gte]: new Date() }
      }
    });

    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Invalid or expired promotion code'
      });
    }

    if (cartValue < promotion.minCartValue) {
      return res.status(400).json({
        success: false,
        message: `Minimum cart value of ${promotion.minCartValue} required`
      });
    }

    let discountAmount = 0;
    if (promotion.type === 'PERCENTAGE') {
      discountAmount = (cartValue * promotion.value) / 100;
    } else {
      discountAmount = promotion.value;
    }

    res.status(200).json({
      success: true,
      data: {
        promotion,
        discountAmount,
        finalAmount: cartValue - discountAmount
      }
    });
  } catch (error) {
    console.error('Error validating promotion code:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to validate promotion code'
    });
  }
};
