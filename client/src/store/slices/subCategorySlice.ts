// @/store/slices/subCategorySlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as subCategoryService from "@/services/subcategoryService";

interface SubCategoryState {
  subCategories: any[];
  error: string | null;
}

const initialState: SubCategoryState = {
  subCategories: [],
  error: null,
};

export const fetchSubCategories = createAsyncThunk(
  "subCategories/fetchSubCategories",
  async () => {
    return subCategoryService.fetchSubCategories();
  }
);

export const createSubCategory = createAsyncThunk(
  "subCategories/createSubCategory",
  async (data: { name: string; categoryId: string }) => {
    return subCategoryService.createSubCategory(data);
  }
);

export const updateSubCategory = createAsyncThunk(
  "subCategories/updateSubCategory",
  async (data: { id: string; name: string; categoryId: string }) => {
    return subCategoryService.updateSubCategory(data);
  }
);

export const deleteSubCategory = createAsyncThunk(
  "subCategories/deleteSubCategory",
  async (id: string) => {
    return subCategoryService.deleteSubCategory(id);
  }
);

const subCategorySlice = createSlice({
  name: "subCategories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSubCategories.fulfilled, (state, action) => {
      state.subCategories = action.payload;
    });
    builder.addCase(deleteSubCategory.fulfilled, (state, action) => {
      state.subCategories = state.subCategories.filter(
        (subCat: any) => subCat.id !== action.meta.arg
      );
    });
  },
});

export const subCategoriesSelector = (state: any) =>
  state.subCategories.subCategories;

export default subCategorySlice.reducer;