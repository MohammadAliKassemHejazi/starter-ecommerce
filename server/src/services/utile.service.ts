import {ICategoryAttributes} from 'interfaces/types/models/category.model.types';

import db from '../models/index';


const getAllCategories = async (): Promise<{ categories: ICategoryAttributes[] } | null> => {
  const categories: ICategoryAttributes[] | null = await db.Category.findAll();
  if (!categories) {
    return null;
  }

  return { categories };
};

const getSubCategories = async (categoryId:string): Promise<{ categories: ICategoryAttributes[] } | null> => {
  const categories: ICategoryAttributes[] | null = await db.SubCategory.findAll({
    where : {categoryId},
    raw: true
  });
  if (!categories) {
    return null;
  }

  return { categories };
};


export default {
  getAllCategories,
  getSubCategories
};
