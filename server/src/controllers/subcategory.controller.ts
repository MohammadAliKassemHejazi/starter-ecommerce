import { NextFunction, Request, Response } from "express";
import * as subCategoryService  from "../services/subCategory.service";
import customError from "../utils/customError";
import subCategoryErrors from "../utils/errors/subCategory.errors";
import { CustomRequest } from "interfaces/types/middlewares/request.middleware.types";

export const handleFetchSubCategories = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.UserId;
    if (!userId) {
      return next(customError(subCategoryErrors.SubCategoryFetchFailure));
    } 
    const subCategories = await subCategoryService.fetchSubCategories(userId);
    res.json(subCategories);
  } catch (error) {
    next(customError(subCategoryErrors.SubCategoryFetchFailure));
  }
};

export const handleCreateSubCategory = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { name, categoryId } = req.body;
  const userId = req.UserId;
  if (!userId) {
      return next(customError(subCategoryErrors.SubCategoryFetchFailure));
    }
  if (!name || !categoryId) {
    res.status(400).json({ error: "Name and Category ID are required" });
    return;
  }

  try {
    const subCategory = await subCategoryService.createSubCategory({ name, categoryId,userId });
    res.status(201).json(subCategory);
  } catch (error) {
    next(customError(subCategoryErrors.SubCategoryCreateFailure));
  }
};

export const handleUpdateSubCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = req.params.id;
  const { name, categoryId } = req.body;

  if (!id || !name || !categoryId) {
    res.status(400).json({ error: "ID, Name, and Category ID are required" });
    return;
  }

  try {
    const subCategory = await subCategoryService.updateSubCategory(id, { name, categoryId });
    res.json(subCategory);
  } catch (error) {
    next(customError(subCategoryErrors.SubCategoryUpdateFailure));
  }
};

export const handleDeleteSubCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = req.params.id;

  if (!id) {
    res.status(400).json({ error: "Subcategory ID is required" });
    return;
  }

  try {
    await subCategoryService.deleteSubCategory(id);
    res.json({ message: "Subcategory deleted successfully" });
  } catch (error) {
    next(customError(subCategoryErrors.SubCategoryDeleteFailure));
  }
};