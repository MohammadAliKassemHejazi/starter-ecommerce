import {  Request,Response,NextFunction } from "express";


import { userService } from "../services"
import { shopService } from "../services"

import { CustomRequest } from '../interfaces/types/middlewares/request.middleware.types';
import { IShopCreateProduct } from "interfaces/types/controllers/shop.controller.types";


export const handleCreateProduct = async (request: CustomRequest, response: Response, next: NextFunction) => {
    try {
      const UserId = request.UserId
        const productData = {...request.body ,"ownerId":UserId} as IShopCreateProduct;
        const files = request.files as  Express.Multer.File[];
        

        // Process product creation with data and files
        const results =  await shopService.createProductWithImages(productData, files);
     
        response.status(200).json({ message: 'Product created successfully' });
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
  response: Response
): Promise<void> => {
  const UserId = request.UserId; // Assuming UserId is accessible via middleware
  const userSession = await userService.userSession(UserId!);
  response.json(userSession);
};





export const handelgetsingleitem = async (
  request: CustomRequest,
  response: Response
): Promise<void> => {
  const UserId = request.UserId; // Assuming UserId is accessible via middleware
  const userSession = await userService.userSession(UserId!);
  response.json(userSession);
};


export default {
  handleCreateProduct,
  handleUpdate,
  handelgetall,
  handelgetsingleitem,
};



