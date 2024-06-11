import { CategoriesState } from "@/interfaces/types/store/slices/utils.types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as utileService from "@/services/utileService";

import { RootState } from "../store";
import { ICategories ,ISubCategories} from "@/models/utils.model";

const initialState: CategoriesState = {
	Categories: [],
	SubCategories:[],
	error: "",
};


export const fetchAllCategories = createAsyncThunk(
	"/utile/categories",
	async () => {
		const response = await utileService.requestAllCategories();
		
		return response
	}
)

export const fetchAllSubCategoriesID = createAsyncThunk(
	"/utile/subcategories",
	async (id: string) => {
		const response = await utileService.requestSubCategoriesId(id);
		return response
	}
)

export const utilsSlice = createSlice({
	name: "utils",
	initialState: initialState,
	reducers: {

	},
	extraReducers: (builder) => {

		builder.addCase(fetchAllCategories.fulfilled, (state, action) => {
			state.Categories = action.payload.data.categories;
		})

		builder.addCase(fetchAllCategories.rejected, (state, action) => {
			state.Categories = [];
		})

		builder.addCase(fetchAllSubCategoriesID.fulfilled, (state, action) => {
			state.SubCategories = action.payload.data.subcategories;
		})

		builder.addCase(fetchAllSubCategoriesID.rejected, (state, action) => {
			state.SubCategories = [];
		})

	

	}
})

export const utileCategoriesSelector = (store: RootState): ICategories[] | undefined => store.utils.Categories;
export const utileSubCategoriesSelector = (store: RootState): ISubCategories[] | undefined => store.utils.SubCategories;


export default utilsSlice.reducer;