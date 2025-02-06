// @/services/categoryService.ts
import httpClient from "@/utils/httpClient";

export const fetchCategories = async () => {
  const response = await httpClient.get("/categories");
  return response.data;
};

export const createCategory = async (data: { name: string; description?: string }) => {
  const response = await httpClient.post("/categories", data);
  return response.data;
};

export const updateCategory = async (data: { id: string; name: string; description?: string }) => {
  const response = await httpClient.put(`/categories/${data.id}`, {
    name: data.name,
    description: data.description,
  });
  return response.data;
};

export const deleteCategory = async (id: string) => {
  await httpClient.delete(`/categories/${id}`);
};