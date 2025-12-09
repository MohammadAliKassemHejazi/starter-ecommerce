import { Response, NextFunction } from "express";
import { shopService, userService } from "../services";
import { CustomRequest } from "../interfaces/types/middlewares/request.middleware.types";
import { canCreateProduct, isSuperAdmin } from "../services/package.service";
import path from "node:path";
import fs from "fs";
import { validationResult } from "express-validator";

export const handleCreateProduct = async (
  request: CustomRequest,
  response: Response,
  next: NextFunction
) => {
  const files = request.files as Express.Multer.File[];

  // Validate request
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() });
  }

  try {
    if (files.length > 0) {
      const UserId = request.UserId;
      
      // Check if user can create products based on their package
      const canCreate = await canCreateProduct(UserId!);
      if (!canCreate) {
        return response.status(403).json({ 
          success: false,
          message: 'Product creation limit reached. Please upgrade your package.' 
        });
      }

      const sizes = JSON.parse(request.body.sizes);
      const productData = { 
        ...request.body, 
        ownerId: UserId, 
        sizes: sizes,
     
      } as any;

      // Process product creation with data and files
      const results = await shopService.createProductWithImages(productData, files);
      
      const responseData: any = {
        success: true,
        product: results,
        message: 'Product created successfully'
      };



      response.status(200).json(responseData);
    } else {
      throw new Error("Images are missing while creating a product");
    }
  } catch (error) {
    try {
      // Ensure all files are deleted asynchronously
      await Promise.all(
        files.map(async (file) => {
          const fileName = file.filename;
          const outputPath = path.join("compressed", fileName);
          fs.unlink(outputPath, (err) => {
            if (err) throw err;
          });
        })
      );
    } catch (deleteError) {
      console.error("Failed to delete files:", deleteError);
    }
    next(error); // Pass error to Express error handling middleware
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
    // Check if user is super admin or owns the product
    const isAdmin = await isSuperAdmin(userId!);
    if (!isAdmin) {
      // For non-super admins, check ownership
      const product = await shopService.getProductById(id);
      if (!product || product.ownerId !== userId) {
        response.status(403).json({
          success: false,
          message: 'You can only delete products that you created'
        });
        return;
      }
    }

    const result: number = await shopService.deleteProduct(id, userId!);
    response.json({
      success: true,
      message: 'Product deleted successfully',
      result
    });
  } catch (error) {
    next(error);
  }
};

export const handleDeleteImage = async (
  request: CustomRequest,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    response.status(400).json({ errors: errors.array() });
    return;
  }

  const id = request.params.id;
  const userId = request.UserId;
  try {
    const result: number = await shopService.deleteProductImage(id, userId!);
    response.json(result);
  } catch (error) {
    next(error);
  }
};


export const handleUpdate = async (
  request: CustomRequest,
  response: Response,
  next: NextFunction
): Promise<void> => {
  // Step 1: Validate the request
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    response.status(400).json({ errors: errors.array() });
  }

  try {
    // Extract user ID and product ID from the request
    const userId = request.UserId;
    const productId = request.body.productID; // Assuming the product ID is passed as a route parameter

    // Extract files and body data
    const files = request.files as Express.Multer.File[] || [];
    const sizes = JSON.parse(request.body.sizes || "[]"); // Parse sizes array
    const productData = { ...request.body, ownerId: userId, sizes } as any;

  

    // Step 2: Update the product
    const updatedProduct = await shopService.updateProductWithImages(productId, productData, files);

    // Step 3: Return the updated product
    response.status(200).json({ product: updatedProduct });
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

export const handleUpdateImages = async (
  request: CustomRequest,
  response: Response,
  next: NextFunction
): Promise<void> => {


  try {

    const productId = request.body.productID; // Assuming the product ID is passed as a route parameter

    // Extract files and body data
    const files = request.files as Express.Multer.File[] || [];

    // Step 2: Update the product
    const updatedProduct = await shopService.updateImages(productId, files);

    // Step 3: Return the updated product
    response.status(200).json({ product: updatedProduct });
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


export const handelgetall = async (
  request: CustomRequest,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const results = await shopService.getTopProductIds();
    response.status(200).json({ ...results });
  } catch (error) {
    next(error);
  }
};

export const handleGetSingleItem = async (
  request: CustomRequest,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    response.status(400).json({ errors: errors.array() });
    return;
  }

  const id = request.query.id as string;
  try {
    const product = await shopService.getProductById(id);
    if (!product) {
      response.status(404).json({ error: "Product not found" });
      return;
    }
    response.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

export const getProductsByStore = async (
  request: CustomRequest,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    response.status(400).json({ errors: errors.array() });
    return;
  }


  const { storeId } = request.params;
  const { page = 1, pageSize = 10, searchQuery ,orderBy} = request.query;

  try {
    const result = await shopService.fetchProductsByStore({
      storeId,
      page: Number(page),
      pageSize: Number(pageSize),
      searchQuery: String(searchQuery),
      orderBy: String(orderBy),
    });
 
    response.json({
      ...result,
    
    });
  } catch (error) {
    next(error);
  }
};

export const getProductsListing = async (
  request: CustomRequest,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    response.status(400).json({ errors: errors.array() });
    return;
  }

  const { page = 1, pageSize = 10 } = request.query;
  try {
    const result = await shopService.fetchProductsListing({
      storeId: "",
      page: Number(page),
      pageSize: Number(pageSize),
    });

    response.json({
      ...result
    });
  } catch (error) {
    next(error);
  }
};

export default {
  handleCreateProduct,
  handleUpdate,
  handelgetall,
  handleGetSingleItem,
  getProductsByStore,
  handleDelete,
  handleDeleteImage,
  getProductsListing,
  handleUpdateImages
};