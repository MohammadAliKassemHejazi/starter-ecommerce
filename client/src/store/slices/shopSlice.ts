import { ProductsState } from "@/interfaces/types/store/slices/shopSlice.types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as shopService from "@/services/shopService";

import { RootState } from "../store";
import { IProductModel, productresponse } from "@/models/product.model";

const initialState: ProductsState = {
  product: undefined,
  products: [],
  Storeproducts: [],
  total: 0,
  page: 1,
  pageSize: 10,
  error: "",
};

export const fetchProductsListing = createAsyncThunk(
  "shop/productListing",
  async ({ page, pageSize }: {page?: number, pageSize: number }) => {
    const response = await shopService.requestProductsListing( page!, pageSize);
    return response;
  }
);

export const fetchProductById = createAsyncThunk(
  "shop/by-id",
  async (id: string) => {
    const response = await shopService.requestProductById(id);
    return response;
  }
);

export const fetchProductsByStore = createAsyncThunk(
  "shop/by-store",
  async ({ storeId, page, pageSize }: { storeId: string, page: number, pageSize: number }) => {
    const response = await shopService.requestProductsByStore(storeId, page, pageSize);
    return response;
  }
);

export const fetchAllProducts = createAsyncThunk("shop/getall", async () => {
  const response = await shopService.requestAllProductID();
  return response;
});

export const createProduct = createAsyncThunk(
  "shop/create",
  async (product: FormData) => {
    const response: productresponse = await shopService.requestCreateProducts(product);
    return response;
  }
);

export const updateProduct = createAsyncThunk(
  "shop/update",
  async (product: FormData) => {
    const response = await shopService.requestUpdateArticles(product);
    return response;
  }
);

export const deleteProduct = createAsyncThunk(
  "shop/delete",
  async (id: string) => {
    const response = await shopService.requestDeleteProduct(id);
    return response;
  }
);

export const deleteProductImage = createAsyncThunk(
  "shop/delete",
  async (id: string) => {
    const response = await shopService.requestDeleteProductImage(id);
    return response;
  }
);

export const articleSlice = createSlice({
  name: "products",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProductById.fulfilled, (state, action) => {
      state.product = action.payload;
    });

    builder.addCase(fetchProductById.rejected, (state) => {
      state.product = undefined;
    });

    builder.addCase(createProduct.fulfilled, (state, action) => {
      state.product = action.payload.product;
    });

    builder.addCase(createProduct.rejected, (state) => {
      state.product = undefined;
    });

    builder.addCase(fetchProductsByStore.fulfilled, (state, action) => {
      console.log(action.payload);
      state.Storeproducts = action.payload.products;
      state.total = action.payload.total;
      state.page = action.payload.page;
      state.pageSize = action.payload.pageSize;
    });

    builder.addCase(fetchProductsByStore.rejected, (state) => {
      state.Storeproducts = [];
      state.total = 0;
      state.page = 1;
      state.pageSize = 10;
    });

    

		builder.addCase(fetchProductsListing.fulfilled, (state, action) => {
      state.products = action.payload.products;
      state.total = action.payload.total;
      state.page = action.payload.page;
      state.pageSize = action.payload.pageSize;
    });

    builder.addCase(fetchProductsListing.rejected, (state) => {
      state.products = [];
      state.total = 0;
      state.page = 1;
      state.pageSize = 10;
    });

  },
});

export const productSelector = (store: RootState): IProductModel[] | undefined => store.products.products;
export const productByStoreSelector = (store: RootState): IProductModel[] | undefined => store.products.Storeproducts;
export const totalProductsSelector = (store: RootState): number => store.products.total;
export const pageSelector = (store: RootState): number => store.products.page;
export const pageSizeSelector = (store: RootState): number => store.products.pageSize;

export default articleSlice.reducer;
