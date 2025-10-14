import db from "../models";
import { Op } from 'sequelize'; // Needed for filtering the array of user IDs
import { ISubCategoryAttributes } from "../interfaces/types/models/subcategory.model.types";
import customError from "../utils/customError";
import subCategoryErrors from "../utils/errors/subCategory.errors";
// Assuming utilService and the models are available in the scope
 import * as utilService from './utile.service'; 


export const fetchSubCategories = async (rootUserId: string): Promise<ISubCategoryAttributes[]> => {
  try {
    // 1. Get all user IDs in the management hierarchy
    // You need to ensure utilService is imported and accessible
    const userIds = await utilService.getManagedUserIds(rootUserId); 

    if (userIds.length === 0) {
      return [];
    }

    // 2. Fetch SubCategories based on managed user IDs
    const subCategories = await db.SubCategory.findAll({
      where: {
        // Filter the SubCategory table by its owner (userId)
        userId: {
          [Op.in]: userIds,
        },
      },
      // Keep the existing include logic to fetch Category details
      include: [
        {
          model: db.Category, 
          attributes: ['id', 'name', 'description'],
        }
      ],
      // Optionally, order the results
      order: [
        [{ model: db.Category }, 'name'], 
        ['name'] 
      ]
    });

    return subCategories;

  } catch (error) {
    console.error('Error fetching subcategories by managed users:', error);
    throw new Error('Failed to fetch subcategories.');
  }
};



export const createSubCategory = async (
  data: { name: string; categoryId: string; userId: string } // Added userId here for completeness
): Promise<ISubCategoryAttributes> => {
  // Assuming the calling context passes the userId of the creator
  const subCategory = await db.SubCategory.create(data); 
  return subCategory;
};



export const updateSubCategory = async (
  id: string,
  data: { name?: string; categoryId?: string } // Optional properties for update
): Promise<ISubCategoryAttributes> => {
  
  const subCategory = await db.SubCategory.findByPk(id);
  if (!subCategory) {
    throw customError(subCategoryErrors.SubCategoryNotFound);
  }

  // ✅ CRITICAL FIX: Use the update instance method to reliably save changes.
  const updatedSubCategory = await subCategory.update(data);

  return updatedSubCategory;
};


export const deleteSubCategory = async (id: string): Promise<void> => {
  const subCategory = await db.SubCategory.findByPk(id);
  if (!subCategory) {
    throw customError(subCategoryErrors.SubCategoryNotFound);
  }

  await subCategory.destroy();
};