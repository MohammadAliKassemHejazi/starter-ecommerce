// @/store/slices/categorySlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as categoryService from "@/services/categoryService";
import { RootState } from "../store";
import { ICategories } from "@/models/utils.model";

interface CategoryState {
  categories: ICategories[];
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  error: null,
};

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    const { data  } = await categoryService.fetchCategories();
    return data;
  }
);

export const createCategory = createAsyncThunk(
  "categories/createCategory",
  async (data: { name: string; description?: string }) => {
    return categoryService.createCategory(data);
  }
);

export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async (data: { id: string; name: string; description?: string }) => {
    return categoryService.updateCategory(data);
  }
);

export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (id: string) => {
    return categoryService.deleteCategory(id);
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.categories = action.payload;
    });
    builder.addCase(deleteCategory.fulfilled, (state, action) => {
      state.categories = state.categories.filter(
        (cat: ICategories) => cat.id !== action.meta.arg
      );
    });
  },
});

export const categoriesSelector = (state: RootState): ICategories[] | undefined => state.categories.categories;

export default categorySlice.reducer;