import db from "../models";
import { ICategoryAttributes } from "../interfaces/types/models/category.model.types";
import customError from "../utils/customError";
import categoryErrors from "../utils/errors/category.errors";

export const fetchCategories = async (): Promise<ICategoryAttributes[]> => {
  const categories = await db.Category.findAll();
  return categories;
};

export const createCategory = async (
  data: { name: string; description?: string }
): Promise<ICategoryAttributes> => {
  const { name, description } = data;
  const category = await db.Category.create({ name, description });
  return category;
};

export const updateCategory = async (
  id: string,
  data: { name: string; description?: string }
): Promise<ICategoryAttributes> => {
  const { name, description } = data;

  const category = await db.Category.findByPk(id);
  if (!category) {
    throw customError(categoryErrors.CategoryNotFound);
  }

  category.name = name;
  category.description = description;
  await category.save();

  return category;
};

export const deleteCategory = async (id: string): Promise<void> => {
  const category = await db.Category.findByPk(id);
  if (!category) {
    throw customError(categoryErrors.CategoryNotFound);
  }

  await category.destroy();
};