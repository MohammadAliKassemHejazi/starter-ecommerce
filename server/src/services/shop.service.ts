
import { IShopCreateProduct } from 'interfaces/types/controllers/shop.controller.types';
import { IProductAttributes } from 'interfaces/types/models/product.model.types';
import { IProductImageAttributes } from 'interfaces/types/models/productimage.model.types';
import db from '../models/index';



 const createProductWithImages = async (productData: IShopCreateProduct, files: Express.Multer.File[]): Promise<any> => {
  try {
     const product = await db.Product.create(productData);


    // const imageUrls = files.map(file => `/uploads/${file.filename}`);
    
    // You can also save the image data to your database if needed
    // Replace this with your actual image data saving logic
    for (const file of files) {
      await db.ProductImage.create({
        productId: product.dataValues.id,
        imageUrl: `/compressed/${file.filename}`
      });
    }

    // Return response with product and image URLs
    return product.dataValues;
    
  } catch (error) {
    // Handle errors appropriately
    throw error;
    
  }
};


const getProductById = async (
  productId: string
): Promise<{ product: IProductAttributes & { croppedPhotos: IProductImageAttributes[] } } | null> => {
  const product: IProductAttributes | null = await db.Product.findOne({
    where: { id: productId },
    raw: true,
  });

  if (!product) {
    return null;
  }

  const images: IProductImageAttributes[] = await db.ProductImage.findAll({
    where: { productId },
    raw: true,
  });

  // Ensure croppedPhotos is set correctly
  const productWithImages = { ...product, croppedPhotos: images };

  return { product: productWithImages };
};


const getTopProductIds = async (
  limit: number = 200
): Promise<any> => {


  const products = await db.Product.findAll({
    attributes: ['id'],
    limit: limit,
    order: [['createdAt', 'DESC']],
    raw: true,
  });


  return products;
};


export default {
  createProductWithImages,
  getProductById,
  getTopProductIds,
};
