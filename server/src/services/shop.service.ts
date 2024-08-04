
import { IShopCreateProduct } from 'interfaces/types/controllers/shop.controller.types';
import { IProductAttributes, } from 'interfaces/types/models/product.model.types';
// import { ISizeAttributes, } from 'interfaces/types/models/size.model.types';
// import { ICommentAttributes } from 'interfaces/types/models/comment.model.types';
// import { IProductImageAttributes } from 'interfaces/types/models/productimage.model.types';
import db from '../models/index';



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
        imageUrl: `/compressed/${file.filename}`
      });
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
          model: db.Size,

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
    return null;
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


export default {
  createProductWithImages,
  getProductById,
  getTopProductIds,
};
