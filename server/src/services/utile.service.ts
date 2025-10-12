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
export const getManagedUserIds = async (rootUserId: string): Promise<string[]> => {
  const query = `
    WITH RECURSIVE user_tree AS (
      -- Anchor: start with the root user
      SELECT id
      FROM "Users"
      WHERE id = :rootUserId

      UNION ALL

      -- Recursive: find users created by anyone in the current tree
      SELECT u.id
      FROM "Users" u
      INNER JOIN user_tree ut ON u."createdById" = ut.id
    )
    SELECT id FROM user_tree;
  `;

  const results = await db.sequelize.query(query, {
    replacements: { rootUserId },
    type: db.sequelize.QueryTypes.SELECT,
  });

  return results.map((row: any) => row.id);
};

export default {
  getManagedUserIds,
  getAllCategories,
  getSubCategories,
  getAllSizes
};
