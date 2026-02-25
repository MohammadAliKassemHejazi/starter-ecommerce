import { FetchProductsByStoreParams, IShopCreateProduct } from 'interfaces/types/controllers/shop.controller.types';
import { IProductAttributes } from 'interfaces/types/models/product.model.types';
import db from '../models/index';
import path from 'path';
import { Op } from 'sequelize';
import { promises as fsPromises } from 'fs';
import { validate as uuidValidate } from 'uuid';
import { IProductImageAttributes } from 'interfaces/types/models/productimage.model.types';

export const createProductWithImages = async (productData: IShopCreateProduct, files: Express.Multer.File[]): Promise<IProductAttributes> => {
  const transaction = await db.sequelize.transaction();
  try {
    // Step 1: Create Product
    const product = await db.Product.create(productData, { transaction });
    const productJSON = product.toJSON() as IProductAttributes;

    // Step 2: Bulk Create Images
    if (files.length > 0) {
      const imageRecords = files.map((file) => ({
        productId: productJSON.id,
        imageUrl: `${file.filename}`,
      }));
      // Optimization: Using bulkCreate within the transaction
      await db.ProductImage.bulkCreate(imageRecords, { transaction });
    }

    // Step 3: Bulk Create Size items
    if (productData.sizes && productData.sizes.length > 0) {
      const sizeRecords = productData.sizes
        .filter((size) => size.sizeId)
        .map((size) => ({
          productId: productJSON.id,
          sizeId: size.sizeId,
          quantity: size.quantity,
        }));

      if (sizeRecords.length > 0) {
        await db.SizeItem.bulkCreate(sizeRecords, { transaction });
      }
    }

    await transaction.commit();
    return productJSON;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const updateProductWithImages = async (
  productId: string,
  productData: IShopCreateProduct,
  files: Express.Multer.File[],
): Promise<IProductAttributes> => {
  const transaction = await db.sequelize.transaction();
  try {
    const product = await db.Product.findByPk(productId, { transaction });
    if (!product) {
      throw new Error('Product not found');
    }

    // Step 2: Update core product data
    await product.update(productData, { transaction });

    // Step 3: Handle Bulk Image Creation
    if (files.length > 0) {
      const imageRecords = files.map((file) => ({