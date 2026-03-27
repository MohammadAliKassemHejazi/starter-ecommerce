export interface ISubCategoryAttributes {
    id?: string; // Unique identifier for the subcategory
    name: string; // Name of the subcategory
    categoryId?: string;
    userId?: string;
    createdAt?: string;
    updatedAt?: string;
    category?: {
        id: string;
        name: string;
        description?: string;
    };
}
