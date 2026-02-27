import { FetchProductsByStoreParams, IShopCreateProduct } from 'interfaces/types/controllers/shop.controller.types';
import { IProductAttributes } from 'interfaces/types/models/product.model.types';
import db from '../models/index';
import path from 'path';
import { Op, Sequelize, Model } from 'sequelize';
import { promises as fsPromises } from 'fs';
import { validate as uuidValidate } from 'uuid';
import { IProductImageAttributes } from 'interfaces/types/models/productimage.model.types';
import { logger } from '../config/logger';

// Local interface mirroring the frontend ProductResponse
// Including ownerId for backend controller permission checks
export interface IProductResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  stockQuantity: number;
  isActive: boolean;
  subcategoryId: string;
  categoryId: string;
  storeId: string;
  ownerId: string; // Required for backend permission checks
  metaTitle?: string;
  metaDescription?: string;
  ratings?: number;
  commentsCount?: number;
  createdAt: string;
  updatedAt: string;
  productImages?: Array<{
    id: string;
    url: string;
    alt?: string;
  }>;
  store?: {
    id: string;
    name: string;
  };
  category?: {
    id: string;
    name: string;
  };
  subcategory?: {
    id: string;
    name: string;
  };
  sizeItems?: Array<{
    id: string;
    size: string;
    sizeId: string;
    quantity: number;
  }>;
}

// Helper to resolve base directory safely
const getBaseDir = (): string => {
    return (global as any).__basedir || path.resolve(__dirname, '../../');
};

// Helper to calculate rating
const calculateRating = (comments: any[]): number => {
  if (!comments || comments.length === 0) return 0;
  const total = comments.reduce((acc, comment) => acc + comment.rating, 0);
  return total / comments.length;
};

// Helper to format product response matching frontend expectations
const formatProduct = (product: Model<IProductAttributes> | any): IProductResponse => {
  const json = typeof product.toJSON === 'function' ? product.toJSON() : product;

  const ratings = calculateRating(json.Comments);
  const commentsCount = json.Comments ? json.Comments.length : 0;

  // Calculate stock quantity from size items
  const stockQuantity = json.SizeItems ? json.SizeItems.reduce((acc: number, item: any) => acc + item.quantity, 0) : 0;

  return {
    id: json.id,
    name: json.name,
    description: json.description,
    price: json.price,
    originalPrice: json.price,
    discount: json.discount || 0,
    stockQuantity,
    isActive: json.isActive,
    subcategoryId: json.subcategoryId,
    categoryId: json.categoryId,
    storeId: json.storeId,
    ownerId: json.ownerId, // Included for controller logic
    metaTitle: json.metaTitle,
    metaDescription: json.metaDescription,
    ratings,
    commentsCount,
    createdAt: json.createdAt,
    updatedAt: json.updatedAt,
    productImages: json.ProductImages ? json.ProductImages.map((img: any) => ({
        id: img.id,
        url: img.imageUrl, // Map imageUrl to url
        alt: img.alt
    })) : [],
    store: json.Store ? {
        id: json.Store.id,
        name: json.Store.name
    } : undefined,
    category: json.Category ? {
        id: json.Category.id,
        name: json.Category.name
    } : undefined,
    subcategory: json.SubCategory ? {
        id: json.SubCategory.id,
        name: json.SubCategory.name
    } : undefined,
    sizeItems: json.SizeItems ? json.SizeItems.map((item: any) => ({
        id: item.id,
        size: item.Size ? item.Size.size : item.sizeId,
        sizeId: item.sizeId,
        quantity: item.quantity
    })) : []
  };
};

export const getProductById = async (id: string): Promise<IProductResponse | null> => {
    const product = await db.Product.findByPk(id, {
        include: [
            { model: db.ProductImage },
            { model: db.Store },
            { model: db.Category },
            { model: db.SubCategory },
            {
                model: db.SizeItem,
                include: [{ model: db.Size }]
            },
            { model: db.Comment },
        ]
    });

    if (!product) return null;

    return formatProduct(product);
};

export const createProductWithImages = async (productData: IShopCreateProduct, files: Express.Multer.File[]): Promise<IProductResponse> => {
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

    // Fetch complete product with associations
    const completeProduct = await getProductById(productJSON.id!);
    if (!completeProduct) throw new Error('Failed to retrieve created product');

    return completeProduct;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const updateProductWithImages = async (
  productId: string,
  productData: IShopCreateProduct,
  files: Express.Multer.File[],
): Promise<IProductResponse> => {
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
        productId: productId,
        imageUrl: `${file.filename}`,
      }));
      await db.ProductImage.bulkCreate(imageRecords, { transaction });
    }

    // Step 4: Handle Size Items
    if (productData.sizes) {
         // First, remove existing size items
        await db.SizeItem.destroy({ where: { productId }, transaction });

        const sizeRecords = productData.sizes
            .filter((size) => size.sizeId)
            .map((size) => ({
            productId: productId,
            sizeId: size.sizeId,
            quantity: size.quantity,
            }));

        if (sizeRecords.length > 0) {
            await db.SizeItem.bulkCreate(sizeRecords, { transaction });
        }
    }

    await transaction.commit();
    // Re-fetch to get all associations for consistent return shape
    const updatedProduct = await getProductById(productId);
    if (!updatedProduct) throw new Error('Failed to retrieve updated product');

    return updatedProduct;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const deleteProduct = async (id: string, userId: string): Promise<number> => {
    const product = await db.Product.findByPk(id, {
        include: [{ model: db.ProductImage }]
    });

    if (!product) return 0;

    // Delete images from filesystem
    if (product.ProductImages) {
        const basedir = getBaseDir();
        await Promise.all(product.ProductImages.map(async (img: any) => {
             const imagePath = path.join(basedir, 'compressed', img.imageUrl);
             try {
                 await fsPromises.unlink(imagePath);
             } catch (e) {
                 logger.warn(`Failed to delete image ${imagePath}`, e);
             }
        }));
    }

    return await db.Product.destroy({ where: { id } });
};

export const deleteProductImage = async (imageId: string, userId: string): Promise<number> => {
    const image = await db.ProductImage.findByPk(imageId);
    if (!image) return 0;

    const basedir = getBaseDir();
    const imagePath = path.join(basedir, 'compressed', image.imageUrl);
     try {
         await fsPromises.unlink(imagePath);
     } catch (e) {
         logger.warn(`Failed to delete image ${imagePath}`, e);
     }

    return await db.ProductImage.destroy({ where: { id: imageId } });
};


export const updateImages = async (productId: string, files: Express.Multer.File[]): Promise<IProductResponse | null> => {
    if (!files || files.length === 0) return await getProductById(productId);

    const imageRecords = files.map((file) => ({
        productId: productId,
        imageUrl: `${file.filename}`,
      }));

    await db.ProductImage.bulkCreate(imageRecords);

    return await getProductById(productId);
};

export const getTopProductIds = async (): Promise<{ products: IProductResponse[] }> => {
    const products = await db.Product.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [
            { model: db.ProductImage },
            { model: db.Store },
             { model: db.Category },
             { model: db.SubCategory },
             {
                model: db.SizeItem,
                include: [{ model: db.Size }]
            },
             { model: db.Comment },
        ]
    });
    return { products: products.map(formatProduct) };
};

export const fetchProductsByStore = async ({
    storeId,
    page,
    pageSize,
    searchQuery,
    orderBy
}: any): Promise<{ products: IProductResponse[], total: number, page: number, pageSize: number }> => {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    const where: any = { storeId };
    if (searchQuery) {
        where.name = { [Op.iLike]: `%${searchQuery}%` };
    }

    let order: any = [['createdAt', 'DESC']];
    if (orderBy === 'price_asc') order = [['price', 'ASC']];
    if (orderBy === 'price_desc') order = [['price', 'DESC']];

    const { count, rows } = await db.Product.findAndCountAll({
        where,
        limit,
        offset,
        order,
        include: [
            { model: db.ProductImage },
             { model: db.Category },
             { model: db.SubCategory },
             {
                model: db.SizeItem,
                include: [{ model: db.Size }]
            },
             { model: db.Comment },
             { model: db.Store },
        ],
        distinct: true,
    });

    const products = rows.map(formatProduct);

    return {
        products,
        total: count,
        page,
        pageSize
    };
};

export const fetchProductsListing = async ({
    page,
    pageSize
}: any): Promise<{ products: IProductResponse[], total: number, page: number, pageSize: number }> => {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    const { count, rows } = await db.Product.findAndCountAll({
        limit,
        offset,
        order: [['createdAt', 'DESC']],
        include: [
             { model: db.ProductImage },
             { model: db.Store },
             { model: db.Category },
             { model: db.SubCategory },
             {
                model: db.SizeItem,
                include: [{ model: db.Size }]
            },
             { model: db.Comment },
        ],
        distinct: true,
    });

    const products = rows.map(formatProduct);

    return {
        products,
        total: count,
        page,
        pageSize
    };
};

export default {
  createProductWithImages,
  updateProductWithImages,
  getProductById,
  deleteProduct,
  deleteProductImage,
  updateImages,
  getTopProductIds,
  fetchProductsByStore,
  fetchProductsListing
};
