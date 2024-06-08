import { StoresState } from "@/interfaces/types/store/slices/storeSlice.types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as storeService from "@/services/storeService";

import { RootState } from "../store";
import { IStoreResponseModel } from "@/models/store.model";

const initialState: StoresState = {
	stores: [],
	error: "",
};

export const fetchStoreById = createAsyncThunk(
	"store/by-id",
	async (id: string) => {
		const response = await storeService.requestStoreById(id)
		return response;
	}
)

export const fetchArticleByAuthor = createAsyncThunk(
	"store/by-author",
	async () => {
		const response = await storeService.requestArticleByAuthor();
		return response
	}
)

export const fetchAllStores = createAsyncThunk(
	"store/fetch",
	async () => {
		const response = await storeService.requestAllStores();
		console.log(response,"store/fetch")
		return response
	}
)

export const createStore = createAsyncThunk(
	"store/create",
	async (store: FormData) => {
		const response: IStoreResponseModel = await storeService.requestCreateStore(store);
		return response
	}
)

export const updateArticles = createAsyncThunk(
	"store/update",
	async (article: IStoreResponseModel) => {
		// const response = await shopService.requestUpdateArticles(article);
		return "response"
	}
)

export const deleteArticles = createAsyncThunk(
	"store/delete",
	async (id: string) => {
		const response = await storeService.requestDeleteArticles(id);
		return response
	}
)

export const articleSlice = createSlice({
	name: "store",
	initialState: initialState,
	reducers: {

	},
	extraReducers: (builder) => {

		builder.addCase(fetchStoreById.fulfilled, (state, action) => {

			state.store = action.payload;
		})

		builder.addCase(fetchStoreById.rejected, (state, action) => {
			state.store = undefined;
		})

		builder.addCase(createStore.fulfilled, (state, action) => {
			state.store = action.payload
        })
        
       builder.addCase(createStore.rejected, (state, action) => {
			state.store = undefined
		})

		builder.addCase(fetchAllStores.fulfilled, (state, action) => {
			console.log(action)
			state.stores = action.payload.stores;
		})

		builder.addCase(fetchAllStores.rejected, (state, action) => {
			state.stores = undefined;
		})


	}
})

export const storeSelector = (store: RootState): IStoreResponseModel[] | undefined => store.store.stores;
export const singleStoreSelector = (store: RootState): IStoreResponseModel | undefined => store.store.store;


export default articleSlice.reducer;