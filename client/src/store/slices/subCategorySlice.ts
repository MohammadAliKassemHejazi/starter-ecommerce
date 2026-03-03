// @/store/slices/subCategorySlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as subCategoryService from "@/services/subCategoryService";
import { RootState } from "../store";
import { ISubCategories } from "@/models/utils.model";

interface SubCategoryState {
  subCategories: ISubCategories[];
  error: string | null;
}

const initialState: SubCategoryState = {
  subCategories: [],
  error: null,
};

export const fetchSubCategories = createAsyncThunk(
  "subCategories/fetchSubCategories",
  async () => {
    const { data } = await subCategoryService.fetchSubCategories();
    console.log(data, 'Fetched subcategories data:');
    return data;
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
        (subCat: ISubCategories) => subCat.id !== action.meta.arg
      );
    });
  },
});

export const subCategoriesSelector = (state: RootState): ISubCategories[] | undefined =>
  state.subCategories.subCategories;

export default subCategorySlice.reducer;