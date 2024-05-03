import {  Response,NextFunction } from "express";


import { userService } from "../services"
import { storeService } from "../services"

import { CustomRequest } from '../interfaces/types/middlewares/request.middleware.types';
import { IStoreCreateProduct } from "interfaces/types/controllers/store.controller.types";


export const handleCreateStore = async (request: CustomRequest, response: Response, next: NextFunction) => {
    try {
      const UserId = request.UserId
        const productData = {...request.body ,"userid":UserId} as IStoreCreateProduct;
        const files = request.files as  Express.Multer.File[];
 

        // Process product creation with data and files
        const results =  await storeService.createStoreWithImages(productData, files);
     
        response.status(200).json({ message: results });
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
  handleCreateStore,
  handleUpdate,
  handelgetall,
  handelgetsingleitem,
};




