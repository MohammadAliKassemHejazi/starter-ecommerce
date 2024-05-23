import {  Response,NextFunction } from "express";


import { userService } from "../services"
import { storeService } from "../services"

import { CustomRequest } from '../interfaces/types/middlewares/request.middleware.types';
import { IStoreCreateProduct } from "interfaces/types/controllers/store.controller.types";


export const handleCreateStore = async (request: CustomRequest, response: Response, next: NextFunction) => {
    try {
      const UserId = request.UserId
        const StoreData = {...request.body ,"userId":UserId} as IStoreCreateProduct;
        const files = request.files as  Express.Multer.File[];
 

        // Process product creation with data and files
        const results: IStoreCreateProduct =  await storeService.createStoreWithImages(StoreData, files);
     
        response.status(200).json(results);
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

export const handelGetAllStores = async (
  request: CustomRequest,
  response: Response,
  next :NextFunction
): Promise<void> => {
  try {
    const Stores = await storeService.getAllStores();
    response.json(Stores);
  } catch (error) {
    next(error);
  }
};


export const handelGetAllCategories = async (
  request: CustomRequest,
  response: Response,
  next :NextFunction
): Promise<void> => {
  try {
    const Stores = await storeService.getAllStores();
    response.json(Stores);
  } catch (error) {
    next(error);
  }

};


export const handelGetSingleItem = async (
  request: CustomRequest,
  response: Response,
  next:NextFunction
): Promise<void> => {
  const storeID = request.params.id; // Assuming UserId is accessible via middleware
  try {
  const userSession = await storeService.getStoreById(storeID!);
  response.json(userSession);
} catch (error) {
  next(error);
}

};


export default {
  handleCreateStore,
  handleUpdate,
  handelGetAllStores,
  handelGetAllCategories,
  handelGetSingleItem,
};




