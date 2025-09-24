import {  Response,NextFunction } from "express";


import { userService } from "../services"
import { storeService } from "../services"

import { CustomRequest } from '../interfaces/types/middlewares/request.middleware.types';
import { TenantRequest } from '../middlewares/rls-tenant.middleware';
import { IStoreCreateProduct } from "interfaces/types/controllers/store.controller.types";
import { canCreateStore, isSuperAdmin } from "../services/package.service";

import path from "node:path";
import fs from "fs";
import { validationResult } from "express-validator";



export const handleCreateStore = async (
  request: CustomRequest | TenantRequest,
  response: Response,
  next: NextFunction
) => {
  const files = request.files as Express.Multer.File[];

  try {
    // Validate request
    const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() });
  }

    if (!files || files.length === 0) {
      throw new Error("Images are missing while creating a store");
    }

    const UserId = request.UserId;
    
    // Check if user can create stores based on their package
    const canCreate = await canCreateStore(UserId!);
    if (!canCreate) {
      return response.status(403).json({ 
        success: false,
        message: 'Store creation limit reached. Please upgrade your package.' 
      });
    }

    const StoreData = { 
      ...request.body, 
      userId: UserId,
      // Add tenant ID if available (for RLS)
      ...(request.tenantId && { tenantId: request.tenantId })
    } as IStoreCreateProduct;

    // Process store creation with data and files
    const results = await storeService.createStoreWithImages(StoreData, files);
    
    const responseData: any = {
      success: true,
      store: results,
      message: 'Store created successfully'
    };

    // Add tenant info if available
    if (request.tenantId) {
      responseData.tenant = {
        id: request.tenantId,
        slug: request.tenantSlug
      };
    }

    response.status(200).json(responseData);

  } catch (error) {
    try {
      // Cleanup uploaded files
      if (files?.length > 0) {
        await Promise.all(
          files.map(async (file) => {
            const fileName = file.filename;
            const outputPath = path.join("compressed", fileName);
            await fs.promises.unlink(outputPath);
          })
        );
      }
    } catch (deleteError) {
      console.error("Failed to delete files:", deleteError);
    }
    
    // Pass error to Express error handler
    next(error);
  }
};

export const handleDelete = async (
  request: CustomRequest,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const id = request.params.id;
  const userId = request.UserId;
  
  try {
    // Check if user is super admin or owns the store
    const isAdmin = await isSuperAdmin(userId!);
    if (!isAdmin) {
      // For non-super admins, check ownership
      const store = await storeService.getStoreById(id);
      if (!store || store.userId !== userId) {
        return response.status(403).json({
          success: false,
          message: 'You can only delete stores that you created'
        });
      }
    }

    const result: number = await storeService.deleteStore(id, userId!);
    response.json({
      success: true,
      message: 'Store deleted successfully',
      result
    });
  } catch (error) {
    next(error);
  }
};


export const handleUpdate = async (
 request: CustomRequest,
  response: Response
): Promise<void> => {
  const UserId = request.UserId; // Assuming UserId is accessible via middleware
  const userSession = await userService.userSession(UserId!);
  response.json(userSession);
};

export const handelGetAllStoresForUser = async (
  request: CustomRequest,
  response: Response,
  next :NextFunction
): Promise<void> => {
  try {
    const UserId = request.UserId;
    const Stores = await storeService.getAllStoresforuser(UserId!);
    response.json(Stores);
  } catch (error) {
    next(error);
  }
};

export const handelGetAllStores = async (
  request: CustomRequest,
  response: Response,
  next :NextFunction
): Promise<void> => {
  try {

    const Stores = await storeService.getAllStores();
    response.json(Stores);
  } catch (error) {
    next(error);
  }
};




export const handelGetSingleItem = async (
  request: CustomRequest,
  response: Response,
  next:NextFunction
): Promise<void> => {
  const storeID = request.query.id as string; // Assuming storeID is accessible 
  try {
  const userSession = await storeService.getStoreById(storeID!);
  response.json(userSession);
} catch (error) {
  next(error);
}

};
export const handleUpdateImages = async (
  request: CustomRequest,
  response: Response,
  next: NextFunction
): Promise<void> => {


  try {

    const storeId = request.body.storeID ; // Assuming the product ID is passed as a route parameter

    // Extract files and body data
    const files = request.files as Express.Multer.File[] || [];

    // Step 2: Update the product
    const updatedstore = await storeService.updateImages(storeId, files);

    // Step 3: Return the updated product
    response.status(200).json({ store: updatedstore });
  } catch (error) {
    // Step 4: Clean up uploaded files in case of an error
    try {
      if (request.files && Array.isArray(request.files)) {
        await Promise.all(
          request.files.map(async (file: Express.Multer.File) => {
            const fileName = file.filename;
            const outputPath = path.join("compressed", fileName);
            fs.unlink(outputPath, (err) => {
              if (err) console.error(`Failed to delete file: ${outputPath}`, err);
            });
          })
        );
      }
    } catch (deleteError) {
      console.error("Failed to clean up files:", deleteError);
    }

    // Pass the error to the error-handling middleware
    next(error);
  }
};

export default {
  handleDelete,
  handleCreateStore,
  handleUpdate,
  handelGetAllStores,
  handelGetSingleItem,
  handleUpdateImages,
  handelGetAllStoresForUser
};




