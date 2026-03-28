import { Response, NextFunction } from 'express';
import { storeService } from '../services';
import { CustomRequest } from '../interfaces/types/middlewares/request.middleware.types';
import { IStoreCreateProduct } from 'interfaces/types/controllers/store.controller.types';
import { canCreateStore } from '../services/package.service';
import path from 'node:path';
import fs from 'node:fs/promises';
import { validationResult } from 'express-validator';
import { logger } from '../config/logger';
import db from '../models';

const handleCreateStore = async (request: CustomRequest, response: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      response.status(400).json({ errors: errors.array() });
      return;
    }
    const storeData: IStoreCreateProduct = request.body;
    storeData.userId = request.UserId;
    const canCreate = await canCreateStore(request.UserId!);
    if (!canCreate) {
      response.status(403).json({ message: 'Store limit reached. Upgrade your package to create more stores.' });
      return;
    }

    const files = request.files as Express.Multer.File[];
    if (files && files.length > 0) {
      storeData.imgUrl = files[0].filename;
    }

    const newStore = await storeService.createStoreWithImages(storeData, files || []);
    response.status(201).json({ success: true, data: newStore });
  } catch (error) {
    next(error);
  }
};

const handleGetStoreById = async (request: CustomRequest, response: Response, next: NextFunction): Promise<void> => {
  try {
    const storeId = request.params.id;
    const store = await storeService.getStoreById(storeId);
    if (store) {
      response.status(200).json({ success: true, data: store.store });
    } else {
      response.status(404).json({ success: false, message: 'Store not found' });
    }
  } catch (error) {
    next(error);
  }
};

const handleGetAllStores = async (request: CustomRequest, response: Response, next: NextFunction): Promise<void> => {
  try {
    const stores = await storeService.getAllStores();
    if (stores) {
      response.status(200).json({ success: true, data: stores });
    } else {
      response.status(404).json({ success: false, message: 'No stores found' });
    }
  } catch (error) {
    next(error);
  }
};

const handleDeleteStore = async (request: CustomRequest, response: Response, next: NextFunction): Promise<void> => {
  try {
    const storeId = request.params.id;
    const userId = request.UserId;
    const result = await storeService.deleteStore(storeId, userId!);
    response.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const handleUpdateImages = async (request: CustomRequest, response: Response, next: NextFunction): Promise<void> => {
  try {
    const storeId = request.params.id;
    const files = request.files as Express.Multer.File[];
    if (!files || files.length === 0) {
       response.status(400).json({ message: 'No files uploaded' });
       return;
    }
    const result = await storeService.updateImages(storeId, files);
    response.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const handleGetAllStoresForUser = async (request: CustomRequest, response: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = request.UserId;
    if (!userId) {
        response.status(400).json({ message: 'User ID is required' });
        return;
    }
    const result = await storeService.getAllStoresforuser(userId);
    response.status(200).json({ success: true, data: result ? result.stores : [] });
  } catch (error) {
    next(error);
  }
};

const handleGetAllStoresForUserWithFilter = async (request: CustomRequest, response: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = request.UserId;
     if (!userId) {
        response.status(400).json({ message: 'User ID is required' });
        return;
    }
    const { search = '', orderBy = '', page = '1', pageSize = '10' } = request.query;

    const pageSizeNum = parseInt(pageSize as string, 10);
    const result = await storeService.getAllStoresForUserWithFilter(
        userId,
        search as string,
        orderBy as string,
        parseInt(page as string, 10),
        pageSizeNum
    );
    response.status(200).json({
      success: true,
      data: result.stores,
      meta: {
        page: result.page,
        pageSize: pageSizeNum,
        total: result.total,
        totalPages: result.totalPages,
      },
    });

  } catch (error) {
      next(error);
  }
};

const handleUpdateStore = async (request: CustomRequest, response: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      response.status(400).json({ errors: errors.array() });
      return;
    }
    const storeId = request.body.storeID || request.params.id;
    if (!storeId) {
      response.status(400).json({ success: false, message: 'Store ID is required' });
      return;
    }
    const userId = request.UserId;
    const storeData: Partial<IStoreCreateProduct> = request.body;

    const store = await storeService.getStoreById(storeId);
    if (!store || !store.store) {
      response.status(404).json({ success: false, message: 'Store not found' });
      return;
    }
    if (store.store.userId !== userId) {
      response.status(403).json({ success: false, message: 'Forbidden' });
      return;
    }

    const updated = await db.Store.update(storeData, { where: { id: storeId, userId } });
    response.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

/**
 * Handles the deletion of a specific store image.
 * Ensures connectivity by returning a standardized success response for Redux.
 */
export const handleDeleteStoreImage = async (
  request: CustomRequest,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const imageId = request.params.id; // Corrected context: usually deleting a specific image record
  const userId = request.UserId;

  try {
    // The service handles the file unlinking and DB record removal
    const result = await storeService.deleteStoreImage(imageId, userId!);

    response.status(200).json({
      success: true,
      message: result.data || 'Store image deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export default {
  handleCreateStore,
  handleGetStoreById,
  handleGetAllStores,
  handleDeleteStore,
  handleUpdateImages,
  handleGetAllStoresForUser,
  handleGetAllStoresForUserWithFilter,
  handleDeleteStoreImage,
  handleUpdateStore,
};
