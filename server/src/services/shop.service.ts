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
        productId,
        imageUrl: `${file.filename}`,
      }));
      await db.ProductImage.bulkCreate(imageRecords, { transaction });
    }

    // Step 4: Update Size Items (Delete and Replace)
    if (productData.sizes && Array.isArray(productData.sizes)) {
      await db.SizeItem.destroy({ where: { productId }, transaction });

      const sizeRecords = productData.sizes
        .filter((size) => size.sizeId)
        .map((size) => ({
          productId,
          sizeId: size.sizeId,
          quantity: size.quantity,
        }));

      if (sizeRecords.length > 0) {
        await db.SizeItem.bulkCreate(sizeRecords, { transaction });
      }
    }

    await transaction.commit();
    return product.toJSON() as IProductAttributes;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const fetchProductsListing = async ({ page, pageSize }: FetchProductsByStoreParams) => {
  const { rows: products, count: total } = await db.Product.findAndCountAll({
    offset: (page - 1) * pageSize,
    limit: pageSize,
    raw: true,
    nest: true,
  });

  // Bulk fetch associated images for all products at once
  const productIds = products.map((product: IProductAttributes) => product.id);
  const images = await db.ProductImage.findAll({
    where: { productId: productIds },
    order: [['createdAt', 'DESC']],
    raw: true,
  });

  // Combine results in memory (avoids N+1 query problem)
  const productsWithImages = products.map((product: IProductAttributes) => {
    const productImages = images.filter((image: IProductImageAttributes) => image.productId === product.id);
    return {
      ...product,
      photos: productImages,
    };
  });

  return { products: productsWithImages, total, page, pageSize };
};

// ... other methods (deleteProduct, getProductById) from original file logic