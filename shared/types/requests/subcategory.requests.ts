// SubCategory Request Body Types

export interface CreateSubCategoryRequest {
  name: string;
  categoryId: string;
}

export interface UpdateSubCategoryRequest {
  name?: string;
  categoryId?: string;
}
