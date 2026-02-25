import db from '../models';
import { ICategoryAttributes } from '../interfaces/types/models/category.model.types';
import customError from '../utils/customError';
import categoryErrors from '../utils/errors/category.errors';

import { Op } from 'sequelize';
import * as utilService from './utile.service';

export const fetchCategories = async (rootUserId: string): Promise<ICategoryAttributes[]> => {
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
      // Optional: Include the Owner/User details if needed for display
      // include: [{
      //   model: db.User,
      //   as: 'Owner',
      //   attributes: ['id', 'name'],
      // }],
    });

    return categories as ICategoryAttributes[];
  } catch (error) {
    console.error('Error fetching categories by managed users:', error);
    // Depending on your error handling policy, you might throw or return an empty array
    throw new Error('Failed to fetch categories.');
  }
};

export const createCategory = async (data: { name: string; description?: string; userId: string }): Promise<ICategoryAttributes> => {
  const { name, description, userId } = data;
  const category = await db.Category.create({ name, description, userId });
  return category;
};

export const updateCategory = async (id: string, data: { name: string; description?: string }): Promise<ICategoryAttributes> => {
  const { name, description } = data;

  const category = await db.Category.findByPk(id);
  if (!category) {
    throw customError(categoryErrors.CategoryNotFound);
  }

  const updatedCategory = await category.update({
    name: name,
    description: description,
  });

  return updatedCategory;
};

export const deleteCategory = async (id: string): Promise<void> => {
  const category = await db.Category.findByPk(id);
  if (!category) {
    throw customError(categoryErrors.CategoryNotFound);
  }

  await category.destroy();
};
