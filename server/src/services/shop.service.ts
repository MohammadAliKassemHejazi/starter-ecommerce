
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
        imageUrl: `/uploads/${file.filename}`
      });
    }

    // Return response with product and image URLs
    return {
      product
    };
  } catch (error) {
    // Handle errors appropriately
    throw error;
    
  }
};


 const getProductById = async (
  productId: string
): Promise<{ product: IProductAttributes; images: IProductImageAttributes[] } | null> => {
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

  return { product, images };
};



export default {
  createProductWithImages,
  getProductById,
};
