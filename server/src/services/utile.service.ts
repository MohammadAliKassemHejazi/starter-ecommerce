import {ICategoryAttributes} from 'interfaces/types/models/category.model.types';

import db from '../models/index';


const getAllCategories = async (): Promise<{ categories: ICategoryAttributes[] } | null> => {
  const categories: ICategoryAttributes[] | null = await db.Category.findAll();
  if (!categories) {
    return null;
  }

  return { categories };
};

export default {
  getAllCategories
};
