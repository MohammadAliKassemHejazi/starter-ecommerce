// interfaces/types/models/subcategory.model.types.ts

/**
 * Interface for Subcategory attributes.
 */
export interface ISubcategoryAttributes {
    id: string; // Unique identifier for the subcategory
    categoryId: string; // Foreign key linking to the Category
    name: string; // Name of the subcategory
  }
  