import { CategoriesState } from "@/interfaces/types/store/slices/utils.types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as utileService from "@/services/utileService";

import { RootState } from "../store";
import { ICategories } from "@/models/utils.model";

const initialState: CategoriesState = {
	Categories: [],
	error: "",
};




export const fetchAllCategories = createAsyncThunk(
	"/store/categories",
	async () => {
		const response = await utileService.requestAllCategories();
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
			state.Categories = action.payload.data;
		})

		builder.addCase(fetchAllCategories.rejected, (state, action) => {
			state.Categories = [];
		})

	

	}
})

export const utileSelector = (store: RootState): ICategories[] | undefined => store.utils.Categories;


export default utilsSlice.reducer;