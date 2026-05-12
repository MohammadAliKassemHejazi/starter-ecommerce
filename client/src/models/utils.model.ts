// Re-exported from shared — single source of truth
export type { ICategory, ISubCategory } from '@shared/types';
// Legacy aliases kept for backward compatibility
export type { ICategory as ICategories, ISubCategory as ISubCategories } from '@shared/types';

export interface ICategoriesErrors {
  id?: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}
