// @/services/subCategoryService.ts
import httpClient from "@/utils/httpClient";

export const fetchSubCategories = async () => {
  const response = await httpClient.get("/subcategories");
  return response.data;
};

export const createSubCategory = async (data: { name: string; categoryId: string }) => {
  const response = await httpClient.post("/subcategories", data);
  return response.data;
};

export const updateSubCategory = async (data: { id: string; name: string; categoryId: string }) => {
  const response = await httpClient.put(`/subcategories/${data.id}`, {
    name: data.name,
    categoryId: data.categoryId,
  });
  return response.data;
};

export const deleteSubCategory = async (id: string) => {
  await httpClient.delete(`/subcategories/${id}`);
};