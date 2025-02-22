import { CustomErrorParams } from "../customError";

export const SubCategoryFetchFailure: CustomErrorParams = {
  message: "Failed to fetch subcategories.",
  code: "SUBCATEGORY001",
  statusCode: 400,
};

export const SubCategoryCreateFailure: CustomErrorParams = {
  message: "Failed to create subcategory.",
  code: "SUBCATEGORY002",
  statusCode: 400,
};

export const SubCategoryUpdateFailure: CustomErrorParams = {
  message: "Failed to update subcategory.",
  code: "SUBCATEGORY003",
  statusCode: 400,
};

export const SubCategoryDeleteFailure: CustomErrorParams = {
  message: "Failed to delete subcategory.",
  code: "SUBCATEGORY004",
  statusCode: 400,
};

export const SubCategoryNotFound: CustomErrorParams = {
  message: "Subcategory not found.",
  code: "SUBCATEGORY005",
  statusCode: 404,
};

export default {
  SubCategoryFetchFailure,
  SubCategoryCreateFailure,
  SubCategoryUpdateFailure,
  SubCategoryDeleteFailure,
  SubCategoryNotFound,
};