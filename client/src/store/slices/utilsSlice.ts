import { CategoriesState } from "@/interfaces/types/store/slices/utils.types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as utileService from "@/services/utileService";

import { RootState } from "../store";
import { ICategories, ISubCategories } from "@/models/utils.model";
import { ISize } from "@/models/size.model";

const initialState: CategoriesState = {
  Categories: [],
  SubCategories: [],
  Size: [],
  error: "",
};

export const fetchAllCategories = createAsyncThunk(
  "/utile/categories",
  async () => {
    const response = await utileService.requestAllCategories();

    return response;
  }
);

export const fetchAllSubCategoriesID = createAsyncThunk(
  "/utile/subcategories",
  async (id: string) => {
    const response = await utileService.requestSubCategoriesId(id);

    return response;
  }
);

export const fetchAllSizes = createAsyncThunk(
  "/utile/getSizes",
  async () => {
    const response = await utileService.requestSizes();

    return response;
  }
);

export const utilsSlice = createSlice({
  name: "utils",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllCategories.fulfilled, (state, action) => {
      state.Categories = action.payload.data.categories;
    });

    builder.addCase(fetchAllCategories.rejected, (state) => {
      state.Categories = [];
    });

    builder.addCase(fetchAllSubCategoriesID.fulfilled, (state, action) => {
      state.SubCategories = action.payload.subcategories;
    });

    builder.addCase(fetchAllSubCategoriesID.rejected, (state) => {
      state.SubCategories = [];
    });

	  builder.addCase(fetchAllSizes.fulfilled, (state, action) => {
		console.log(action)
      state.Size = action.payload;
    });

    builder.addCase(fetchAllSizes.rejected, (state) => {
      state.Size = [];
    });
  },
});

export const utileCategoriesSelector = (
  store: RootState
): ICategories[] | undefined => store.utils.Categories;
export const utileSubCategoriesSelector = (
  store: RootState
): ISubCategories[] | undefined => store.utils.SubCategories;
export const utileSizes = (store: RootState): ISize[] | undefined =>
  store.utils.Size;

export default utilsSlice.reducer;
