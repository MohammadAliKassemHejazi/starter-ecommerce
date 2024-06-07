import { ProductsState } from "@/interfaces/types/store/slices/shopSlice.types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as shopService from "@/services/shopService";

import { RootState } from "../store";
import { IProductModel } from "@/models/product.model";

const initialState: ProductsState = {
	products: [],
	error: "",
};

export const fetchProductById = createAsyncThunk(
	"shop/by-id",
	async (id: string) => {
		const response = await shopService.requestProductById(id)
		return response;
	}

)

export const fetchArticleByAuthor = createAsyncThunk(
	"shop/by-author",
	async () => {
		const response = await shopService.requestArticleByAuthor();
		return response
	}
)

export const fetchAllProducts = createAsyncThunk(
	"shop/fetch",
	async () => {
		const response = await shopService.requestAllArticles();
		return response
	}
)

export const createProduct = createAsyncThunk(
	"shop/create",
	async (product : FormData) => {
		const response: IProductModel = await shopService.requestCreateProducts(product);
		return response
	}
)

export const updateProduct = createAsyncThunk(
	"shop/update",
	async (product: FormData) => {
		const response = await shopService.requestUpdateArticles(product);
		return response
	}
)

export const deleteArticles = createAsyncThunk(
	"shop/delete",
	async (id: string) => {
		const response = await shopService.requestDeleteArticles(id);
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
			state.product = action.payload;
		})

		builder.addCase(fetchProductById.rejected, (state, action) => {
			state.product = undefined;
		})

		builder.addCase(createProduct.fulfilled, (state, action) => {
			state.product = action.payload
		})


	}
})

export const productSelector = (store: RootState): IProductModel[] | undefined => store.products.products;


export default articleSlice.reducer;