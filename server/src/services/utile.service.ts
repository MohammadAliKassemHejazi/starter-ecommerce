import {ICategoryAttributes} from 'interfaces/types/models/category.model.types';

import db from '../models/index';
import { ISubCategoryAttributes } from 'interfaces/types/models/subcategory.model.types';
import { ISizeAttributes } from 'interfaces/types/models/size.model.types';



const getAllCategories = async (): Promise<{ categories: ICategoryAttributes[] } | null> => {
  const categories: ICategoryAttributes[] | null = await db.Category.findAll();
  if (!categories) {
    return null;
  }

  return { categories };
};

const getSubCategories = async (categoryId:string): Promise<{ subcategories: ISubCategoryAttributes[] } | null> => {
  const subcategories: ISubCategoryAttributes[] | null = await db.SubCategory.findAll(
    {where : {categoryId:categoryId}}
  );

  if (!subcategories) {
    return null;
  }

  return { subcategories };
};

const getAllSizes = async (): Promise<ISizeAttributes[]  | null> => {
  const Sizes : ISizeAttributes[] = await db.Size.findAll({ raw: true });
  if (!Sizes) {
    return null;
  }

  return  Sizes  ;
};


export default {
  getAllCategories,
  getSubCategories,
  getAllSizes
};
