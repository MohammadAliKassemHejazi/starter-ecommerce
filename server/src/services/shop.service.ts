
import { FetchProductsByStoreParams, IShopCreateProduct } from 'interfaces/types/controllers/shop.controller.types';
import { IProductAttributes, } from 'interfaces/types/models/product.model.types';
// import { ISizeAttributes, } from 'interfaces/types/models/size.model.types';
// import { ICommentAttributes } from 'interfaces/types/models/comment.model.types';
// import { IProductImageAttributes } from 'interfaces/types/models/productimage.model.types';
import db from '../models/index';
import fs from 'fs';
import path from 'path';



 const createProductWithImages = async (productData: IShopCreateProduct, files: Express.Multer.File[]): Promise<IProductAttributes> => {
  try {
    const product = await db.Product.create(productData);
    const productJSON = product.toJSON() as IProductAttributes;

    // const imageUrls = files.map(file => `/uploads/${file.filename}`);
    
    // You can also save the image data to your database if needed
    // Replace this with your actual image data saving logic
    for (const file of files) {
      await db.ProductImage.create({
        productId: productJSON.id,
        imageUrl: `${file.filename}`
      });
    }

        // Step 3: Create the size items

    for (const size of productData.sizes ?? []) {
        if(size.sizeId ?? 0> 0){
        await db.SizeItem.create({
          productId: productJSON.id,
          sizeId: size.sizeId,
          quantity: size.quantity,
        });
          }
      }
    

    // Return response with product and image URLs
    return productJSON;
    
  } catch (error) {
    // Handle errors appropriately
    throw error;
    
  }
};


const getProductById = async (
  productId: string
): Promise< IProductAttributes | null> => {
  try {
const product = await db.Product.findOne({
      where: { id: productId },
      include: [
        {
          model: db.ProductImage,
        },
        {
          model: db.Comment,
          limit: 3, // Limit to 3 comments
          order: [['rating', 'DESC']], // Order by rating in descending order
        },
        {
          model: db.SizeItem,
          include: [
            {
              model: db.Size, // Assuming SizeItem is associated with Size
              attributes: ['size'], // Fetch only the 'size' attribute
            },
          ],
        },
      ],
      raw: false, // Allow inclusion of associated models
      nest: true, // Nest the results to properly align the data structure
    });

    if (!product) {
      return null;
    }

    // Fetch the average rating separately
    const ratingResult = await db.Comment.findAll({
      attributes: [
        [db.sequelize.fn('AVG', db.sequelize.col('rating')), 'averageRating']
      ],
      where: { productId },
      raw: true,
    });

    product.rating = ratingResult?.[0]?.averageRating || 0;

    // Flatten the product object to include the average rating directly
    // const productWithDetails = {
    //   ...product, // Convert Sequelize instance to plain object

    // };
    const productJson = product.toJSON() as IProductAttributes
    return  productJson ;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
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



export const deleteProduct = async (id: string, userId: string): Promise<any | null> => {
  try {
    // Fetch product and related images
    const product = await db.Product.findOne({
      where: { id, ownerId:userId },
      include: [{ model: db.ProductImage }],
      raw: true,
      nest:true,
    });

    if (!product) {
      throw new Error('Product not found');
    }

    const images = [product.ProductImages] ?? [];


    // Delete images from filesystem
    images.forEach((photo: any) => {
      if(photo.id ?? 0 > 0){
      const imagePath = path.resolve(__dirname, '..', '/compressed', photo.imageUrl); // Adjust the path as necessary
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error(`Failed to delete image: ${imagePath}`, err);
        }
      });
        }
    });


    // Delete product and related records
    await db.Product.destroy({ where: { id, ownerId:userId } });

  } catch (error) {
    throw error;
  }
};

export const deleteProductImage = async (id: string, userId: string): Promise<any | null> => {
  try {
    // Fetch product and related images
    const ProductImage = await db.ProductImage.findOne({
      where: { id, ownerId:userId },
   
    });

    if (!ProductImage) {
      throw new Error('Product not found');
    }



    // Delete images from filesystem
    ProductImage.forEach((photo: any) => {
      const imagePath = path.resolve(__dirname, '..', '/compressed', photo.imageUrl); // Adjust the path as necessary
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error(`Failed to delete image: ${imagePath}`, err);
        }
      });
    });


    // Delete product and related records
    await db.ProductImage.destroy({ where: { id, ownerId:userId } });

  } catch (error) {
    throw error;
  }
};

export const fetchProductsByStore = async ({ storeId,ownerId, page, pageSize }: FetchProductsByStoreParams) => {
  const { rows:products, count:total } = await db.Product.findAndCountAll({
    where: { storeId, ownerId },
    offset: (page - 1) * pageSize,
    limit: pageSize,
       include: [
        {
           model: db.ProductImage,
           limit: 1,
         order: [['createdAt', 'DESC']],
        },
      ],
      raw: true, // Allow inclusion of associated models
      nest: true, // Nest the results to properly align the data structure
  });

  return { products, total, page, pageSize };
};

export const fetchProductsListing = async ({ page, pageSize }: FetchProductsByStoreParams) => {
  const { rows:products, count:total } = await db.Product.findAndCountAll({
    offset: (page - 1) * pageSize,
    limit: pageSize,
       include: [
        {
           model: db.ProductImage,
           limit: 1,
         order: [['createdAt', 'DESC']],
        },
      ],
      raw: true, // Allow inclusion of associated models
      nest: true, // Nest the results to properly align the data structure
  });

  return { products, total, page, pageSize };
};



export default {
  createProductWithImages,
  getProductById,
  getTopProductIds,
  deleteProduct,
  fetchProductsByStore,
  deleteProductImage,
  fetchProductsListing
};
