import {  Response,NextFunction } from "express";

import { utileService } from "../services"

import { CustomRequest } from '../interfaces/types/middlewares/request.middleware.types';


export const handelGetAllCategories = async (
  request: CustomRequest,
  response: Response,
  next :NextFunction
): Promise<void> => {
  try {
    const categories = await utileService.getAllCategories();
    response.json(categories);
  } catch (error) {
    next(error);
  }

};


export default {
  handelGetAllCategories,
};




