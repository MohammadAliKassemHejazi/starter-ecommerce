import { Response, NextFunction } from 'express';
import { userService, storeService } from '../services';
import { CustomRequest } from '../interfaces/types/middlewares/request.middleware.types';
import { IStoreCreateProduct } from 'interfaces/types/controllers/store.controller.types';
import { canCreateStore, isSuperAdmin } from '../services/package.service';
import path from 'node:path';
import fs from 'node:fs/promises'; // Standardized to promises
import { validationResult } from 'express-validator';

export const handleCreateStore = async (request: CustomRequest, response: Response, next: NextFunction) => {
  const files = request.files as Express.Multer.File[];

  try {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ success: false, errors: errors.array() });
    }

    if (!files || files.length === 0) {
      throw new Error('Images are missing while creating a store');
    }

    const UserId = request.UserId;

    const canCreate = await canCreateStore(UserId!);
    if (!canCreate) {
      return response.status(403).json({
        success: false,
        message: 'Store creation limit reached. Please upgrade your package.',
      });
    }

    const StoreData = {
      ...request.body,
      userId: UserId,
    } as IStoreCreateProduct;

    const results = await storeService.createStoreWithImages(StoreData, files);

    response.status(200).json({
      success: true,
      store: results,
      message: 'Store created successfully',
    });
  } catch (error) {
    await cleanupFiles(files);
    next(error);
  }
};

export const handleUpdateImages = async (request: CustomRequest, response: Response, next: NextFunction): Promise<void> => {
  const files = (request.files as Express.Multer.File[]) || [];
  try {
    const storeId = request.body.storeID;
    const userId = request.UserId;

    // Security Check: Admin or Owner only
    const isAdmin = await isSuperAdmin(userId!);
    if (!isAdmin) {
      const storeData = await storeService.getStoreById(storeId);
      if (!storeData || !storeData.store || storeData.store.userId !== userId) {
        response.status(403).json({
          success: false,
          message: 'You do not have permission to update this store image'
        });
        return;
      }
    }

    const updatedStore = await storeService.updateImages(storeId, files);

    response.status(200).json({ 
      success: true, 
      store: updatedStore 
    });
  } catch (error) {
    await cleanupFiles(files);
    next(error);
  }
};

// Reusable cleanup helper to keep logic dry
const cleanupFiles = async (files: Express.Multer.File[]) => {
  if (!files || files.length === 0) return;
  try {
    await Promise.all(
      files.map(async (file) => {
        const outputPath = path.join('compressed', file.filename);
        await fs.unlink(outputPath).catch(() => {}); // Ignore if already deleted
      })
    );
  } catch (err) {
    console.error('Cleanup failed:', err);
  }
};

// ... other handlers (handleDelete, handleGetAllStores, etc.) stay the same
// but ensure they return { success: true, data: ... } for frontend consistency.

export default {
  handleDelete,
  handleCreateStore,
  handleUpdate,
  handelGetAllStores,
  handelGetSingleItem,
  handleUpdateImages,
  handelGetAllStoresForUser,
  handleGetAllStoresForUserwithFilter,
};