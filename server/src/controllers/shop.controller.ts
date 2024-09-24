import {  Response,NextFunction } from "express";


import { shopService,userService } from "../services"

import { CustomRequest } from '../interfaces/types/middlewares/request.middleware.types';
import { IShopCreateProduct } from "interfaces/types/controllers/shop.controller.types";
import { unlink } from "fs/promises";
import { error } from "console";
import path from 'node:path';
import fs from 'fs';


export const handleCreateProduct = async (request: CustomRequest, response: Response, next: NextFunction) => {
      const files = request.files as Express.Multer.File[];
  try {
    if(files.length > 0){
      const UserId = request.UserId
      const sizes = JSON.parse(request.body.sizes);
      const productData = {...request.body ,"ownerId":UserId,"sizes":sizes} as any;
     
        // Process product creation with data and files
        const results =  await shopService.createProductWithImages(productData, files);
     
      response.status(200).json({ product: results });
    }
    else {
      throw error("images are missing while creating a product")
    }
    } catch (error) {
   try {
      // Ensure all files are deleted asynchronously
      await Promise.all(
        files.map(async (file) => {
          const fileName = file.filename;
      
          const outputPath = path.join('compressed', fileName);
           fs.unlink(outputPath, (err) => {
    if (err) {
      throw err;
    }
  }); // Use fs.promises.unlink
        })
      );
    } catch (deleteError) {
      console.error('Failed to delete files:', deleteError);
    }
        next(error); // Pass error to Express error handling middleware
    }
};


export const handleDelete = async (
  request: CustomRequest,
  response: Response,
  next:NextFunction,
): Promise<void> => {
  const id = request.params.id;
  const userId = request.UserId;
  try {
    const result: number = await shopService.deleteProduct(id, userId!);
    response.json(result);
  } catch (error) {
    next(error)
    response.status(500).json({ error: "Internal Server Error" });
  }
};

export const handleDeleteImage = async (
  request: CustomRequest,
  response: Response,
  next:NextFunction,
): Promise<void> => {
  const id = request.params.id;
  const userId = request.UserId;
  try {
    const result: number = await shopService.deleteProductImage(id, userId!);
    response.json(result);
  } catch (error) {
    next(error)
    response.status(500).json({ error: "Internal Server Error" });
  }
};


export const handleUpdate = async (
 request: CustomRequest,
  response: Response
): Promise<void> => {
  const UserId = request.UserId; // Assuming UserId is accessible via middleware
  const userSession = await userService.userSession(UserId!);
  response.json(userSession);
};

export const handelgetall = async (
  request: CustomRequest,
  response: Response,
  next:NextFunction
): Promise<void> => {
  try {
   
      const results =  await shopService.getTopProductIds();
   
      response.status(200).json({ message: results });
  } catch (error) {
      next(error); // Pass error to Express error handling middleware
  }
};





export const handleGetSingleItem = async (
  request: CustomRequest,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const id = request.query.id as string; // Assuming id is always a string in your case

  if (!id) {
    response.status(400).json({ error: "Article ID is required" });
    return;
  }

  try {
    const  product = await shopService.getProductById(id);

    if (!product) {
      response.status(404).json({ error: "Product not found" });
      return;
    }

    response.status(200).json(product);
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
};


export const getProductsByStore =
  async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  const UserId = req.UserId;
  const { storeId } = req.params;
  const { page = 1, pageSize = 10 } = req.query;

  try {
    
    const result = await shopService.fetchProductsByStore({
      storeId,
      ownerId:UserId!,
      page: Number(page),
      pageSize: Number(pageSize),
    });
     const transformedProducts = result.products.map((product: any) => ({
      ...product,
      photos: [product.ProductImages], // Rename field here
      ProductImages: undefined, // Optionally remove the old field
    }));
    res.json({
      ...result,
      products: transformedProducts,
    });
  } catch (error) {
    next(error);

  }
  };

  export const getProductsListing =
  async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {


  const { page = 1, pageSize = 10 } = req.query;

  try {
    
    const result = await shopService.fetchProductsListing({
      storeId:"",
      ownerId:"",
      page: Number(page),
      pageSize: Number(pageSize),
    });

     const transformedProducts = result.products.map((product: any) => ({
      ...product,
      photos: [product.ProductImages], // Rename field here
      ProductImages: undefined, // Optionally remove the old field
     }));
    
    res.json({
      ...result,
      products: transformedProducts,
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
  getProductsListing
};




