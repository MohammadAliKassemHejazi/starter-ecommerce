import db from "../models";
import { ISubCategoryAttributes } from "../interfaces/types/models/subcategory.model.types";
import customError from "../utils/customError";
import subCategoryErrors from "../utils/errors/subCategory.errors";

export const fetchSubCategories = async (): Promise<ISubCategoryAttributes[]> => {
  // Use 'include' to fetch the associated Category data based on the 'categoryId' foreign key
  const subCategories = await db.SubCategory.findAll({
    include: [
      {
        model: db.Category, // Include the associated Category
        // Sequelize usually infers the alias from the model name if not explicitly set in the association
        // In your SubCategory model: SubCategory.belongsTo(models.Category, { targetKey: 'id', foreignKey: 'categoryId' });
        // The attribute name for the association in the result will typically be the model name 'Category'
        attributes: ['id', 'name', 'description'], // Fetch only necessary Category fields, adjust as needed
      }
    ],
    // Optionally, order the results
    order: [
      [{ model: db.Category }, 'name'], // Order by Category name first
      ['name'] // Then by SubCategory name
    ]
  });

  // The result will now have the shape:
  // {
  //   id: "...",
  //   name: "...",
  //   categoryId: "..." (or null if not set in the db record),
  //   Category: { id: "...", name: "...", description: "..." } (or null if categoryId is null or doesn't match a Category),
  //   createdAt: "...",
  //   updatedAt: "..."
  // }
console.log(subCategories, 'Fetched subcategories from DB:');
  return subCategories;
};
export const createSubCategory = async (
  data: { name: string; categoryId: string }
): Promise<ISubCategoryAttributes> => {
  const { name, categoryId } = data;
  const subCategory = await db.SubCategory.create({ name, categoryId });
  return subCategory;
};

export const updateSubCategory = async (
  id: string,
  data: { name: string; categoryId: string }
): Promise<ISubCategoryAttributes> => {
  const { name, categoryId } = data;

  const subCategory = await db.SubCategory.findByPk(id);
  if (!subCategory) {
    throw customError(subCategoryErrors.SubCategoryNotFound);
  }

  subCategory.name = name;
  subCategory.categoryId = categoryId;
  await subCategory.save();

  return subCategory;
};

export const deleteSubCategory = async (id: string): Promise<void> => {
  const subCategory = await db.SubCategory.findByPk(id);
  if (!subCategory) {
    throw customError(subCategoryErrors.SubCategoryNotFound);
  }

  await subCategory.destroy();
};