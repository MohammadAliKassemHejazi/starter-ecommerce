import { ISize } from '@shared/types/product.types';
import { ICategory, ISubCategory } from '@shared/types';

export interface CategoriesState {
  Categorie?: ICategory;
  Categories?: ICategory[];
  SubCategories?: ISubCategory[];
  Size?: ISize[];
  error?: string;
}
