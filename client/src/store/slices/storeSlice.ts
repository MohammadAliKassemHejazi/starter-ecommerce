import { StoresState } from "@/interfaces/types/store/slices/storeSlice.types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as storeService from "@/services/storeService";

import { RootState } from "../store";
import { IStoreModel } from "@/models/store.model";

const initialState: StoresState = {
	stores: [],
	error: "",
};

export const fetchProductById = createAsyncThunk(
	"product/by-id",
	async (id: string) => {
		const response = await storeService.requestProductById(id)
		return response;
	}

)

export const fetchArticleByAuthor = createAsyncThunk(
	"articles/by-author",
	async () => {
		const response = await storeService.requestArticleByAuthor();
		return response
	}
)

export const fetchAllArticles = createAsyncThunk(
	"articles/fetch",
	async () => {
		const response = await storeService.requestAllArticles();
		return response
	}
)

export const createStore = createAsyncThunk(
	"shop/create",
	async (store: FormData) => {
		const response: IStoreModel = await storeService.requestCreateStore(store);
		return response
	}
)

export const updateArticles = createAsyncThunk(
	"articles/update",
	async (article: IStoreModel) => {
		// const response = await shopService.requestUpdateArticles(article);
		return "response"
	}
)

export const deleteArticles = createAsyncThunk(
	"articles/delete",
	async (id: string) => {
		const response = await storeService.requestDeleteArticles(id);
		return response
	}
)

export const articleSlice = createSlice({
	name: "products",
	initialState: initialState,
	reducers: {

	},
	extraReducers: (builder) => {

		builder.addCase(fetchProductById.fulfilled, (state, action) => {
			state.store = action.payload;
		})

		builder.addCase(fetchProductById.rejected, (state, action) => {
			state.store = undefined;
		})

		builder.addCase(createStore.fulfilled, (state, action) => {
			state.store = action.payload
			console.log(state.store,"state.store")
        })
        
       builder.addCase(createStore.rejected, (state, action) => {
			state.store = undefined
		})


	}
})

export const storeSelector = (store: RootState): IStoreModel[] | undefined => store.store.stores;


export default articleSlice.reducer;