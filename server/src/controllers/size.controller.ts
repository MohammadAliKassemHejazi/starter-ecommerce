import { Request, Response } from 'express';
import db from '../models';
import { ResponseFormatter } from '../utils/responseFormatter';

export const getSizes = async (req: Request, res: Response) => {
  try {
    const sizes = await db.Size.findAll({
      order: [['size', 'ASC']]
    });

    ResponseFormatter.success(res, sizes, 'Sizes retrieved successfully');
  } catch (error) {
    console.error('Error getting sizes:', error);
    ResponseFormatter.error(res, 'Failed to get sizes', 500);
  }
};

export const createSize = async (req: Request, res: Response) => {
  try {
    const { size } = req.body;

    const sizeRecord = await db.Size.create({ size });

    ResponseFormatter.success(res, sizeRecord, 'Size created successfully', 201);
  } catch (error) {
    console.error('Error creating size:', error);
    ResponseFormatter.error(res, 'Failed to create size', 500);
  }
};

export const updateSize = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { size } = req.body;

    const sizeRecord = await db.Size.findByPk(id);
    if (!sizeRecord) {
      return ResponseFormatter.notFound(res, 'Size not found');
    }

    await sizeRecord.update({ size });

    ResponseFormatter.success(res, sizeRecord, 'Size updated successfully');
  } catch (error) {
    console.error('Error updating size:', error);
    ResponseFormatter.error(res, 'Failed to update size', 500);
  }
};

export const deleteSize = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const sizeRecord = await db.Size.findByPk(id);
    if (!sizeRecord) {
      return ResponseFormatter.notFound(res, 'Size not found');
    }

    await sizeRecord.destroy();

    ResponseFormatter.success(res, null, 'Size deleted successfully');
  } catch (error) {
    console.error('Error deleting size:', error);
    ResponseFormatter.error(res, 'Failed to delete size', 500);
  }
};

export const getSizeItems = async (req: Request, res: Response) => {
  try {
    const { productId } = req.query;
    const { page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const whereClause: any = {};
    if (productId) whereClause.productId = productId;

    const { count, rows } = await db.SizeItem.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: db.Product,
          attributes: ['id', 'name']
        },
        {
          model: db.Size,
          attributes: ['id', 'size']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset
    });

    ResponseFormatter.paginated(res, rows, Number(page), Number(limit), count, 'Size items retrieved successfully');
  } catch (error) {
    console.error('Error getting size items:', error);
    ResponseFormatter.error(res, 'Failed to get size items', 500);
  }
};

export const createSizeItem = async (req: Request, res: Response) => {
  try {
    const { productId, sizeId, quantity } = req.body;

    const sizeItem = await db.SizeItem.create({
      productId,
      sizeId,
      quantity
    });

    ResponseFormatter.success(res, sizeItem, 'Size item created successfully', 201);
  } catch (error) {
    console.error('Error creating size item:', error);
    ResponseFormatter.error(res, 'Failed to create size item', 500);
  }
};

export const updateSizeItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const sizeItem = await db.SizeItem.findByPk(id);
    if (!sizeItem) {
      return ResponseFormatter.notFound(res, 'Size item not found');
    }

    await sizeItem.update({ quantity });

    ResponseFormatter.success(res, sizeItem, 'Size item updated successfully');
  } catch (error) {
    console.error('Error updating size item:', error);
    ResponseFormatter.error(res, 'Failed to update size item', 500);
  }
};

export const deleteSizeItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const sizeItem = await db.SizeItem.findByPk(id);
    if (!sizeItem) {
      return ResponseFormatter.notFound(res, 'Size item not found');
    }

    await sizeItem.destroy();

    ResponseFormatter.success(res, null, 'Size item deleted successfully');
  } catch (error) {
    console.error('Error deleting size item:', error);
    ResponseFormatter.error(res, 'Failed to delete size item', 500);
  }
};
