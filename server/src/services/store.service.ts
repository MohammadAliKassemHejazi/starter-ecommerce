import { IStoreCreateProduct } from 'interfaces/types/controllers/store.controller.types';

import db from '../models/index';
import { IStoreAttributes } from 'interfaces/types/models/store.model.types';
import path from 'node:path';
import { promises as fsPromises } from 'fs';
import { raw } from 'body-parser';


 const createStoreWithImages = async (storeData: IStoreCreateProduct, files: Express.Multer.File[]): Promise<any> => {
     try {
          var Store =  storeData
         if (files.length > 0) {
              Store = await db.Store.create({ ...storeData , imgUrl :`${files[0].filename}`});
         }
         else {
             throw Error
         }

    return  Store  ;
  } catch (error) {

    throw error;
    
  }
};

export const deleteStore = async (id: string, userId: string): Promise<any | null> => {
  try {
    // Fetch store and related images
    const store = await db.Store.findOne({
      where: { id, userId },
      raw:true
    });

    // Check if the store exists
    if (!store) {
      throw new Error('Product not found or you do not have permission to delete it');
    }

    // Extract related images
    const images = [store.imgUrl || ""]; // Fallback to empty array if no images exist

    // Delete images from the filesystem using Promise.all
    await Promise.all(
      images.map(async (photo: any) => {
                const outputPath = path.join(__dirname,"..","..", 'compressed', photo); // Specify output path for compressed file

        const imagePath = path.join(__dirname,  '..', '..', 'compressed', photo); // Adjust the path as necessary
        try {
          await fsPromises.unlink(imagePath); // Use fs.promises.unlink for async file deletion
        } catch (err) {
          console.error(`Failed to delete image: ${imagePath}`, err);
        }
      })
    );

    // Delete the store and its related records (cascading will handle ProductImages)
    await db.Store.destroy({ where: { id,  userId } });

    return { message: 'store and associated images deleted successfully' };
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};
 const getStoreById = async (
  StoretId: string
): Promise<{ store: IStoreAttributes } | null> => {
  const store: IStoreAttributes  = await db.Store.findOne({
    where: { id: StoretId },
    raw: true,
  });
 
  return  { store };
};

const getAllStoresforuser = async (UserID: string): Promise<{ stores: IStoreAttributes[] } | null> => {
  const stores: IStoreAttributes[] | null = await db.Store.findAll({
    where: { userId: UserID },
  });
  if (!stores) {
    return null;
  }



  return { stores };
};

const getAllStores = async (): Promise<{ stores: IStoreAttributes[] } | null> => {
  const stores: IStoreAttributes[] | null = await db.Store.findAll();
  if (!stores) {
    return null;
  }



  return { stores };
};


export const updateImages = async (
  storeId: string,
  files: Express.Multer.File[]
): Promise<any> => {
  try {
    // Step 1: Find the Store by ID
    const store = await db.Store.findByPk(storeId);
    if (!store) {
      throw new Error("Store not found");
    }

    // Step 2: Validate uploaded files
    if (files.length === 0) {
      throw new Error("No files provided");
    }

    // Step 3: Resolve the old image path and delete the old image file (if it exists)
    const oldImageUrl = store.dataValues.imgUrl; // Get the current image URL
    if (oldImageUrl) {
      const uploadDir = path.join(__dirname, '..', '..', 'compressed'); // Path to the uploads directory
      const oldImagePath = path.join(uploadDir, oldImageUrl); // Construct the full path to the old image

      // Check if the old image file exists and delete it
      try {
        await fsPromises.unlink(oldImagePath);
        console.log(`Deleted old image: ${oldImagePath}`);
      } catch (err: any) {
        if (err.code !== 'ENOENT') {
          console.error(`Failed to delete old image: ${oldImagePath}`, err);
          throw new Error('Failed to delete old store image');
        }
        console.warn(`Old image not found, skipping deletion: ${oldImagePath}`);
      }
    }

    // Step 4: Update the imgUrl field with the first file's filename
    const newImageUrl = `${files[0].filename}`; // Use the first file's filename as the image URL
    await store.update({ imgUrl: newImageUrl });

    // Step 5: Return the updated store data
    return {
      storeId,
      updatedImageUrl: newImageUrl,
    };
  } catch (error) {
    console.error("Error updating store image:", error);
    throw error;
  }
};


export const deleteStoreImage = async (storeId: string, userId: string): Promise<any | null> => {
  try {
    // Step 1: Fetch the store by ID
    const store = await db.Store.findOne({
      where: { id: storeId }, // Find the store by its ID
      raw: true, // Use raw query to get plain JSON data
    });

    // Step 2: Check if the store exists
    if (!store) {
      throw new Error('Store not found');
    }

    // Step 3: Verify ownership (ensure the store belongs to the user)
    if (store.userId !== userId) {
      throw new Error('You do not have permission to delete this store image');
    }

    // Step 4: Resolve the file path
    const oldImageUrl = store.imgUrl; // Get the current image URL
    if (!oldImageUrl) {
      throw new Error('No image to delete');
    }

    const filePath = path.join(__dirname, '..', '..', 'compressed', oldImageUrl);

    // Step 5: Delete the file from the filesystem (if it exists)
    try {
      await fsPromises.unlink(filePath);
      console.log(`Deleted file: ${filePath}`);
    } catch (err: any) {
      if (err.code !== 'ENOENT') {
        console.error(`Failed to delete file: ${filePath}`, err);
        throw new Error('Failed to delete store image file');
      }
      console.warn(`File not found, skipping deletion: ${filePath}`);
    }

    // Step 6: Update the store's imgUrl field to null
    await db.Store.update(
      { imgUrl: null }, // Set imgUrl to null
      { where: { id: storeId } } // Update the specific store
    );

    // Step 7: Return success response
    return { data: 'Store image deleted successfully' };
  } catch (error) {
    // Step 8: Handle errors gracefully
    console.error('Error deleting store image:', error);

    // Rethrow the error to propagate it up the call stack
    throw error;
  }
};

export default {
  createStoreWithImages,
  getStoreById,
  getAllStores,
  deleteStore,
  updateImages,
  getAllStoresforuser
};
