import { NextFunction, Request, Response } from "express";
import * as  categoryService  from "../services/category.service";
import customError from "../utils/customError";
import categoryErrors from "../utils/errors/category.errors";
import { CustomRequest } from "interfaces/types/middlewares/request.middleware.types";

export const handleFetchCategories = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userid = req.UserId;
    if (!userid) {
      return next(customError(categoryErrors.CategoryFetchFailure));
    }
    const categories = await categoryService.fetchCategories(userid);
    res.json(categories);
  } catch (error) {
    next(customError(categoryErrors.CategoryFetchFailure));
  }
};

export const handleCreateCategory = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { name, description } = req.body;
  const userId = req.UserId;
  if (!userId) {
      return next(customError(categoryErrors.CategoryFetchFailure));
    }
  if (!name) {
    res.status(400).json({ error: "Category name is required" });
    return;
  }

  try {
    const category = await categoryService.createCategory({ name, description ,userId });
    res.status(201).json(category);
  } catch (error) {
    next(customError(categoryErrors.CategoryCreateFailure));
  }
};

export const handleUpdateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = req.params.id;
  const { name, description } = req.body;

  if (!id || !name) {
    res.status(400).json({ error: "Category ID and name are required" });
    return;
  }

  try {
    const category = await categoryService.updateCategory(id, { name, description });
    res.json(category);
  } catch (error) {
    next(customError(categoryErrors.CategoryUpdateFailure));
  }
};

export const handleDeleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = req.params.id;

  if (!id) {
    res.status(400).json({ error: "Category ID is required" });
    return;
  }

  try {
    await categoryService.deleteCategory(id);
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    next(customError(categoryErrors.CategoryDeleteFailure));
  }
};