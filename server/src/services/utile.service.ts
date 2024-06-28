import {ICategoryAttributes} from 'interfaces/types/models/category.model.types';

import db from '../models/index';
import { ISubcategoryAttributes } from 'interfaces/types/models/subcategory.model.types';


const getAllCategories = async (): Promise<{ categories: ICategoryAttributes[] } | null> => {
  const categories: ICategoryAttributes[] | null = await db.Category.findAll();
  if (!categories) {
    return null;
  }

  return { categories };
};

const getSubCategories = async (categoryId:string): Promise<{ subcategories: ISubcategoryAttributes[] } | null> => {
  const subcategories: ISubcategoryAttributes[] | null = await db.SubCategory.findAll();

  if (!subcategories) {
    return null;
  }

  return { subcategories };
};


export default {
  getAllCategories,
  getSubCategories
};
