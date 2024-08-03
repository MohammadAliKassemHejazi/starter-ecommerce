import {  Response,NextFunction } from "express";

import { articleService, userService } from "../services"
import { shopService } from "../services"

import { CustomRequest } from '../interfaces/types/middlewares/request.middleware.types';
import { IShopCreateProduct } from "interfaces/types/controllers/shop.controller.types";
import { IArticleAttributes } from "interfaces/types/models/article.model.types";
import { IProductAttributes } from "interfaces/types/models/product.model.types";


export const handleCreateProduct = async (request: CustomRequest, response: Response, next: NextFunction) => {
    try {
      const UserId = request.UserId
        const productData = {...request.body ,"ownerId":UserId} as IShopCreateProduct;
        const files = request.files as  Express.Multer.File[];
        // Process product creation with data and files
        const results =  await shopService.createProductWithImages(productData, files);
     
        response.status(200).json({ product:results });
    } catch (error) {
        next(error); // Pass error to Express error handling middleware
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


export default {
  handleCreateProduct,
  handleUpdate,
  handelgetall,
  handleGetSingleItem,
};




