// @/services/categoryService.ts
import httpClient from "@/utils/httpClient";
import { 
	CategoriesListResponse, 
	CreateCategoryResponse, 
	UpdateCategoryResponse, 
	DeleteCategoryResponse 
} from "@/interfaces/api/category.types";

export const fetchCategories = async (): Promise<CategoriesListResponse> => {
  const { data: response } = await httpClient.get<CategoriesListResponse>("/categories");
  return response;
};

export const createCategory = async (data: { name: string; description?: string }): Promise<CreateCategoryResponse> => {
  const { data: response } = await httpClient.post<CreateCategoryResponse>("/categories", data);
  return response;
};

export const updateCategory = async (data: { id: string; name: string; description?: string }): Promise<UpdateCategoryResponse> => {
  const { data: response } = await httpClient.put<UpdateCategoryResponse>(`/categories/update/${data.id}`, {
    name: data.name,
    description: data.description,
  });
  return response;
};

export const deleteCategory = async (id: string): Promise<DeleteCategoryResponse> => {
  const { data: response } = await httpClient.delete<DeleteCategoryResponse>(`/categories/delete/${id}`);
  return response;
};