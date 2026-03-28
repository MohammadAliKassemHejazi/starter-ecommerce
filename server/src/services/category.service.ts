import db from '../models';
import { ICategoryAttributes } from '../interfaces/types/models/category.model.types';
import customError from '../utils/customError';
import categoryErrors from '../utils/errors/category.errors';

import { Op } from 'sequelize';
import * as utilService from './utile.service';
import { ICategory } from '@shared/types/category.types';

// Helper to format category for the frontend
export const formatCategory = (category: any): ICategory => {
  const plainCategory = category.get ? category.get({ plain: true }) : category;

  const result: any = {
    id: plainCategory.id,
    name: plainCategory.name,
    description: plainCategory.description,
    userId: plainCategory.userId,
    createdAt: plainCategory.createdAt,
    updatedAt: plainCategory.updatedAt,
  };

  if (plainCategory.Owner) {
    result.createdBy = {
      id: plainCategory.Owner.id,
      name: plainCategory.Owner.name,
      email: plainCategory.Owner.email,
    };
  }

  if (plainCategory.SubCategories) {
    result.subcategories = plainCategory.SubCategories.map((sub: any) => ({
       id: sub.id,
       name: sub.name,
       description: sub.description
    }));
  }

  return result;
};

export const fetchCategories = async (rootUserId: string): Promise<ICategory[]> => {
  try {
    // 1. Get all user IDs in the management hierarchy (including the root user)
    const userIds = await utilService.getManagedUserIds(rootUserId);

    // Safety check: if the list is empty, return early
    if (userIds.length === 0) {
      return [];
    }

    // 2. Fetch all Categories whose 'userId' is present in the list of managed user IDs
    const categories = await db.Category.findAll({
      where: {
        userId: {
          [Op.in]: userIds, // Use Sequelize's Op.in to filter by the array of IDs
        },
      },
      include: [
        {
          model: db.User,
          as: 'Owner',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: db.SubCategory,
          as: 'SubCategories',
          attributes: ['id', 'name', 'description']
        }
      ],
    });

    return categories.map(formatCategory);
  } catch (error) {
    console.error('Error fetching categories by managed users:', error);
    // Depending on your error handling policy, you might throw or return an empty array
    throw new Error('Failed to fetch categories.');
  }
};

export const createCategory = async (data: { name: string; description?: string; userId: string }): Promise<ICategory> => {
  const { name, description, userId } = data;
  const category = await db.Category.create({ name, description, userId });

  // Refetch to get standard shape
  const fetchedCategory = await db.Category.findByPk(category.id, {
    include: [
      {
        model: db.User,
        as: 'Owner',
        attributes: ['id', 'name', 'email'],
      },
      {
        model: db.SubCategory,
        as: 'SubCategories',
        attributes: ['id', 'name', 'description']
      }
    ],
  });

  return formatCategory(fetchedCategory);
};

export const updateCategory = async (id: string, data: { name: string; description?: string }): Promise<ICategory> => {
  const { name, description } = data;

  const category = await db.Category.findByPk(id);
  if (!category) {
    throw customError(categoryErrors.CategoryNotFound);
  }

  await category.update({
    name: name,
    description: description,
  });

  // Refetch to get standard shape
  const updatedCategory = await db.Category.findByPk(category.id, {
    include: [
      {
        model: db.User,
        as: 'Owner',
        attributes: ['id', 'name', 'email'],
      },
      {
        model: db.SubCategory,
        as: 'SubCategories',
        attributes: ['id', 'name', 'description']
      }
    ],
  });

  return formatCategory(updatedCategory);
};

export const deleteCategory = async (id: string): Promise<void> => {
  const category = await db.Category.findByPk(id);
  if (!category) {
    throw customError(categoryErrors.CategoryNotFound);
  }

  await category.destroy();
};
