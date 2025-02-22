import db from "../models";
import { ISubCategoryAttributes } from "../interfaces/types/models/subcategory.model.types";
import customError from "../utils/customError";
import subCategoryErrors from "../utils/errors/subCategory.errors";

export const fetchSubCategories = async (): Promise<ISubCategoryAttributes[]> => {
  const subCategories = await db.SubCategory.findAll();
  return subCategories;
};

export const createSubCategory = async (
  data: { name: string; categoryId: string }
): Promise<ISubCategoryAttributes> => {
  const { name, categoryId } = data;
  const subCategory = await db.SubCategory.create({ name, categoryId });
  return subCategory;
};

export const updateSubCategory = async (
  id: string,
  data: { name: string; categoryId: string }
): Promise<ISubCategoryAttributes> => {
  const { name, categoryId } = data;

  const subCategory = await db.SubCategory.findByPk(id);
  if (!subCategory) {
    throw customError(subCategoryErrors.SubCategoryNotFound);
  }

  subCategory.name = name;
  subCategory.categoryId = categoryId;
  await subCategory.save();

  return subCategory;
};

export const deleteSubCategory = async (id: string): Promise<void> => {
  const subCategory = await db.SubCategory.findByPk(id);
  if (!subCategory) {
    throw customError(subCategoryErrors.SubCategoryNotFound);
  }

  await subCategory.destroy();
};