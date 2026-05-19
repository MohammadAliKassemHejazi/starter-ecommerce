import { NextFunction, Request, Response } from 'express';
import * as categoryService from '../services/category.service';
import customError from '../utils/customError';
import categoryErrors from '../utils/errors/category.errors';
import { CustomRequest } from 'interfaces/types/middlewares/request.middleware.types';

export const handleFetchCategories = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userid = req.UserId;
    if (!userid) {
      return next(customError(categoryErrors.CategoryFetchFailure));
    }
    const categories = await categoryService.fetchCategories(userid);
    res.json({ success: true, message: 'Categories retrieved successfully', data: categories });
  } catch (error) {
    next(customError(categoryErrors.CategoryFetchFailure));
  }
};

export const handleCreateCategory = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  const { name, description } = req.body;
  const userId = req.UserId;
  if (!userId) {
    return next(customError(categoryErrors.CategoryFetchFailure));
  }
  if (!name) {
    res.status(400).json({ success: false, message: 'Category name is required', data: null });
    return;
  }

  try {
    const category = await categoryService.createCategory({ name, description, userId });
    res.status(201).json({ success: true, message: 'Category created successfully', data: category });
  } catch (error) {
    next(customError(categoryErrors.CategoryCreateFailure));
  }
};

export const handleUpdateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const id = req.params.id;
  const { name, description } = req.body;

  if (!id || !name) {
    res.status(400).json({ success: false, message: 'Category ID and name are required', data: null });
    return;
  }

  try {
    const category = await categoryService.updateCategory(id, { name, description });
    res.json({ success: true, message: 'Category updated successfully', data: category });
  } catch (error) {
    next(customError(categoryErrors.CategoryUpdateFailure));
  }
};

export const handleDeleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const id = req.params.id;

  if (!id) {
    res.status(400).json({ success: false, message: 'Category ID is required', data: null });
    return;
  }

  try {
    await categoryService.deleteCategory(id);
    res.json({ success: true, message: 'Category deleted successfully', data: null });
  } catch (error) {
    next(customError(categoryErrors.CategoryDeleteFailure));
  }
};
