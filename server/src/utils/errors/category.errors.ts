import { CustomErrorParams } from "../customError";

export const CategoryFetchFailure: CustomErrorParams = {
  message: "Failed to fetch categories.",
  code: "CATEGORY001",
  statusCode: 400,
};

export const CategoryCreateFailure: CustomErrorParams = {
  message: "Failed to create category.",
  code: "CATEGORY002",
  statusCode: 400,
};

export const CategoryUpdateFailure: CustomErrorParams = {
  message: "Failed to update category.",
  code: "CATEGORY003",
  statusCode: 400,
};

export const CategoryDeleteFailure: CustomErrorParams = {
  message: "Failed to delete category.",
  code: "CATEGORY004",
  statusCode: 400,
};

export const CategoryNotFound: CustomErrorParams = {
  message: "Category not found.",
  code: "CATEGORY005",
  statusCode: 404,
};

export default {
  CategoryFetchFailure,
  CategoryCreateFailure,
  CategoryUpdateFailure,
  CategoryDeleteFailure,
  CategoryNotFound,
};