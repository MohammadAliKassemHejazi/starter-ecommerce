import { Request, Response } from 'express';
import db from '../models';
import { ResponseFormatter } from '../utils/responseFormatter';

export const getPackages = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows } = await db.Package.findAndCountAll({
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset
    });

    ResponseFormatter.paginated(res, rows, Number(page), Number(limit), count, 'Packages retrieved successfully');
  } catch (error) {
    console.error('Error getting packages:', error);
    ResponseFormatter.error(res, 'Failed to get packages', 500);
  }
};

export const getPackageById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const packageRecord = await db.Package.findByPk(id, {
      include: [
        {
          model: db.User,
          through: { attributes: ['purchaseDate', 'expirationDate'] },
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!packageRecord) {
      return ResponseFormatter.notFound(res, 'Package not found');
    }

    ResponseFormatter.success(res, packageRecord, 'Package retrieved successfully');
  } catch (error) {
    console.error('Error getting package:', error);
    ResponseFormatter.error(res, 'Failed to get package', 500);
  }
};

export const createPackage = async (req: Request, res: Response) => {
  try {
    const { name, description, storeLimit, categoryLimit } = req.body;

    const packageRecord = await db.Package.create({
      name,
      description,
      storeLimit,
      categoryLimit
    });

    ResponseFormatter.success(res, packageRecord, 'Package created successfully', 201);
  } catch (error) {
    console.error('Error creating package:', error);
    ResponseFormatter.error(res, 'Failed to create package', 500);
  }
};

export const updatePackage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, storeLimit, categoryLimit } = req.body;

    const packageRecord = await db.Package.findByPk(id);
    if (!packageRecord) {
      return ResponseFormatter.notFound(res, 'Package not found');
    }

    await packageRecord.update({
      name,
      description,
      storeLimit,
      categoryLimit
    });

    ResponseFormatter.success(res, packageRecord, 'Package updated successfully');
  } catch (error) {
    console.error('Error updating package:', error);
    ResponseFormatter.error(res, 'Failed to update package', 500);
  }
};

export const deletePackage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const packageRecord = await db.Package.findByPk(id);
    if (!packageRecord) {
      return ResponseFormatter.notFound(res, 'Package not found');
    }

    await packageRecord.destroy();

    ResponseFormatter.success(res, null, 'Package deleted successfully');
  } catch (error) {
    console.error('Error deleting package:', error);
    ResponseFormatter.error(res, 'Failed to delete package', 500);
  }
};

export const assignPackageToUser = async (req: Request, res: Response) => {
  try {
    const { userId, packageId, expirationDate } = req.body;

    const userPackage = await db.UserPackage.create({
      userId,
      packageId,
      purchaseDate: new Date(),
      expirationDate: new Date(expirationDate)
    });

    ResponseFormatter.success(res, userPackage, 'Package assigned to user successfully', 201);
  } catch (error) {
    console.error('Error assigning package to user:', error);
    ResponseFormatter.error(res, 'Failed to assign package to user', 500);
  }
};
