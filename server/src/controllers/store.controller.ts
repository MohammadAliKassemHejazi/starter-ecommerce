import { Response, NextFunction } from 'express';
import { userService, storeService } from '../services';
import { CustomRequest } from '../interfaces/types/middlewares/request.middleware.types';
import { IStoreCreateProduct } from 'interfaces/types/controllers/store.controller.types';
import { canCreateStore, isSuperAdmin } from '../services/package.service';
import path from 'node:path';
import fs from 'node:fs/promises';
import { validationResult } from 'express-validator';

// ... (handleCreateStore and handleUpdateImages remain as previously unified)

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

// Reusable cleanup helper for failed uploads
const cleanupFiles = async (files: Express.Multer.File[]) => {
  if (!files || files.length === 0) return;
  try {
    await Promise.all(
      files.map(async (file) => {
        const outputPath = path.join('compressed', file.filename);
        await fs.unlink(outputPath).catch(() => {}); 
      })
    );
  } catch (err) {
    console.error('Cleanup failed:', err);
  }
};

export default {
  handleDelete, // Assuming this is defined elsewhere in your file
  handle