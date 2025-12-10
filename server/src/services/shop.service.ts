
import { FetchProductsByStoreParams, IShopCreateProduct } from 'interfaces/types/controllers/shop.controller.types';
import { IProductAttributes, } from 'interfaces/types/models/product.model.types';
// import { ISizeAttributes, } from 'interfaces/types/models/size.model.types';
// import { ICommentAttributes } from 'interfaces/types/models/comment.model.types';
// import { IProductImageAttributes } from 'interfaces/types/models/productimage.model.types';
import db from '../models/index';
import path from 'path';
import { Op, or } from "sequelize"; // Import Op
import { promises as fsPromises } from 'fs';

import { validate as uuidValidate } from "uuid";
import { IProductImageAttributes } from 'interfaces/types/models/productimage.model.types';


 export const createProductWithImages = async (productData: IShopCreateProduct, files: Express.Multer.File[]): Promise<IProductAttributes> => {
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


export const updateProductWithImages = async (
  productId: string,
  productData: IShopCreateProduct,
  files: Express.Multer.File[]
): Promise<IProductAttributes> => {
  try {
    // Step 1: Find the product by ID
    const product = await db.Product.findByPk(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    // Step 2: Update the product data
    await product.update(productData);

    // Step 3: Handle new images
    if (files.length > 0) {
      for (const file of files) {
        await db.ProductImage.create({
          productId,
          imageUrl: `${file.filename}`,
        });
      }
    }

    // Step 4: Update size items
    if (productData.sizes && Array.isArray(productData.sizes)) {
      // Delete existing size items
      await db.SizeItem.destroy({ where: { productId } });

      // Create new size items
      for (const size of productData.sizes) {
        if (size.sizeId) {
          await db.SizeItem.create({
            productId,
            sizeId: size.sizeId,
            quantity: size.quantity,
          });
        }
      }
    }

    // Step 5: Return the updated product
    return product.toJSON() as IProductAttributes;
  } catch (error) {
    throw error;
  }
};

export const updateImages = async (
  productId: string,
  files: Express.Multer.File[]
): Promise<any> => {
  try {
    // Step 1: Find the product by ID
    const product = await db.Product.findByPk(productId);
    if (!product) {
      throw new Error("Product not found");
    }
  


    let images;
    // Step 3: Handle new images
    if (files.length > 0) {
      for (const file of files) {
       images = await db.ProductImage.create({
          productId,
          imageUrl: `${file.filename}`,
        });
      }
    }  else {
       throw new Error("files not found");
    }



    // Step 5: Return the updated product
    return images.toJSON() ;
  } catch (error) {
    throw error;
  }
};

export const getProductById = async (
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




export const getTopProductIds = async (
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
      where: { id, ownerId: userId }, // Ensure the product belongs to the user
      include: [{ model: db.ProductImage }], // Include related ProductImages
    });

    // Check if the product exists
    if (!product) {
      throw new Error('Product not found or you do not have permission to delete it');
    }

    // Extract related images
    const images = product.ProductImages || []; // Fallback to empty array if no images exist

    // Delete images from the filesystem using Promise.all
    await Promise.all(
      images.map(async (photo: any) => {
        const imagePath = path.resolve(__dirname, '..', '/compressed', photo.dataValues.imageUrl); // Adjust the path as necessary
        try {
          await fsPromises.unlink(imagePath); // Use fs.promises.unlink for async file deletion
        } catch (err) {
          console.error(`Failed to delete image: ${imagePath}`, err);
        }
      })
    );

    // Delete the product and its related records (cascading will handle ProductImages)
    await db.Product.destroy({ where: { id, ownerId: userId } });

    return { message: 'Product and associated images deleted successfully' };
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};



export const deleteProductImage = async (id: string, userId: string): Promise<any | null> => {
  try {
    // Step 1: Fetch the product image and associated product
    const productImage = await db.ProductImage.findOne({
      where: { id }, // Find the image by its ID
      include: [{ model: db.Product }],
      raw:true// Include the associated Product to check ownership
    });

    // Step 2: Check if the product image exists
    if (!productImage) {
      throw new Error('Product image not found');
    }

    // Step 3: Verify ownership (ensure the product belongs to the user)
    if (productImage['Product.ownerId'] !== userId) {
      throw new Error('You do not have permission to delete this product image');
    }

// Step 3: Resolve the file path
    const filePath = path.join(__dirname, '..', '..', 'compressed', productImage.imageUrl);

    // Step 4: Delete the file from the filesystem (if it exists)
    try {
      await fsPromises.unlink(filePath);
      console.log(`Deleted file: ${filePath}`);
    } catch (err :any) {
      if (err.code !== 'ENOENT') {
        console.error(`Failed to delete file: ${filePath}`, err);
        throw new Error('Failed to delete product image file');
      }
      console.warn(`File not found, skipping deletion: ${filePath}`);
    }

    // Step 7: Delete the product image record from the database
    await db.ProductImage.destroy({ where: { id } });

    // Step 8: Return success response
    return { data: 'Product image deleted successfully' };
  } catch (error) {
    // Step 9: Handle errors gracefully
    console.error('Error deleting product image:', error);

    // Rethrow the error to propagate it up the call stack
    throw error;
  }
};



interface SearchCondition {
  name?: { [Op.like]: string };
  id?: { [Op.eq]: string };
}


export const fetchProductsByStore = async ({
  storeId,
  page,
  pageSize,
  searchQuery,
  orderBy,
}: FetchProductsByStoreParams) => {
  // Build the "where" clause dynamically
  const whereClause: any = { storeId };

  if (searchQuery) {
    const searchConditions: SearchCondition[] = [
      { name: { [Op.like]: `%${searchQuery}%` } }, // Partial match for name
    ];

    // Only add the ID condition if the searchQuery is a valid UUID
    if (uuidValidate(searchQuery)) {
      searchConditions.push({ id: { [Op.eq]: searchQuery } }); // Exact match for UUID
    }

    whereClause[Op.or] = searchConditions;
  }

  // Define the order clause based on the searchQuery (filtering option)
  let orderClause: [string, string][] = [];

  switch (orderBy) {
    case "rating":
      orderClause = [["ratings", "DESC"]]; // Sort by highest rating first
      break;

    case "price-low-high":
      orderClause = [["price", "ASC"]]; // Sort by price in ascending order
      break;

    case "price-high-low":
      orderClause = [["price", "DESC"]]; // Sort by price in descending order
      break;

    case "a-z":
      orderClause = [["name", "ASC"]]; // Sort alphabetically A-Z
      break;

    case "z-a":
      orderClause = [["name", "DESC"]]; // Sort alphabetically Z-A
      break;
    default:
      orderClause = []; // No specific sorting if no filter is applied
      break;
  }

  // Fetch products with pagination and sorting
  const { rows: products, count: total } = await db.Product.findAndCountAll({
    where: whereClause,
    offset: (page - 1) * pageSize,
    limit: pageSize,
    order: orderClause, // Apply the dynamic order clause
    raw: true,
    nest: true,
  });

  // Fetch associated images
  const productIds = products.map((product: IProductAttributes) => product.id);
  const images = await db.ProductImage.findAll({
    where: { productId: productIds },
    order: [["createdAt", "DESC"]],
    raw: true,
  });

  // Combine products and images
  const productsWithImages = products.map((product: IProductAttributes) => {
    const productImages = images.filter(
      (image: IProductImageAttributes) => image.productId === product.id
    );
    return {
      ...product,
      photos: productImages,
    };
  });

  return { products: productsWithImages, total, page, pageSize };
};



export const fetchProductsListing = async ({ page, pageSize }: FetchProductsByStoreParams) => {
const { rows: products, count: total } = await db.Product.findAndCountAll({
  offset: (page - 1) * pageSize,
  limit: pageSize,
  raw: true,
  nest: true,
});

// Fetch associated images
const productIds = products.map((product:IProductAttributes) => product.id);
const images = await db.ProductImage.findAll({
  where: { productId: productIds },
  order: [["createdAt", "DESC"]],
  raw: true,
});

// Combine products and images
const productsWithImages = products.map((product:IProductAttributes) => {
  const productImages = images.filter((image:IProductImageAttributes) => image.productId === product.id);
  return {
    ...product,
    photos: productImages,
  };
});

return { products: productsWithImages, total, page, pageSize };
};



export default {
  updateProductWithImages,
  createProductWithImages,
  getProductById,
  getTopProductIds,
  deleteProduct,
  fetchProductsByStore,
  deleteProductImage,
  fetchProductsListing,
  updateImages
};
