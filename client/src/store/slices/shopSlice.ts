import { ProductsState } from "@/interfaces/types/store/slices/shopSlice.types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as shopService from "@/services/shopService";

import { RootState } from "../store";
import { IProductModel } from "@/models/product.model";

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
  async ({ page, pageSize }: { page?: number, pageSize: number }) => {
    if (((page ?? 0) <= 0) || pageSize <= 0) {
      throw new Error("Invalid page or pageSize");
    }
    const response = await shopService.requestProductsListing(page!, pageSize);
  
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
  async ({
    storeId,
    page,
    pageSize,
    searchQuery = "",
    orderBy = "",// Add searchQuery as an optional parameter
  }: {
    storeId: string;
    page: number;
    pageSize: number;
      searchQuery?: string;
   orderBy?: string
  }) => {
    const response = await shopService.requestProductsByStore(
      storeId,
      page,
      pageSize,
      searchQuery,
      orderBy// Pass searchQuery to the API
    );
  
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
    const response = await shopService.requestCreateProducts(product);
    return response;
  }
);

export const updateProduct = createAsyncThunk(
  "shop/update",
  async (product: FormData) => {
    const response = await shopService.requestUpdateProduct(product);
    return response;
  }
);
export const updateProductImages = createAsyncThunk(
  "shop/update",
  async (Images: FormData) => {
    const response = await shopService.requestUpdateProductImages(Images);
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
  "shop/delete/image",
  async (id: string) => {
    const response = await shopService.requestDeleteProductImage(id);
    return response;
  }
);

export const articleSlice = createSlice({
  name: "products",
  initialState: initialState,
  reducers: {
    resetProducts: (state) => {
      state.products = []; 
      state.Storeproducts = [];
      state.total = 0;
      state.page = 1; 
      state.pageSize = 10; 
      state.error = ""; 
      state.product = undefined; 
    }},
  extraReducers: (builder) => {
    builder.addCase(fetchProductById.fulfilled, (state, action) => {
      state.product = action.payload.data;
    });

    builder.addCase(fetchProductById.rejected, (state) => {
      state.product = undefined;
    });

    builder.addCase(createProduct.fulfilled, (state, action) => {
      state.product = action.payload.data;
    });

    builder.addCase(createProduct.rejected, (state) => {
      state.product = undefined;
    });

    builder.addCase(fetchProductsByStore.fulfilled, (state, action) => {
     //here we replace the products array with new data
      state.Storeproducts = action.payload.data.products;
      state.total = action.payload.data.total;
      state.page = action.payload.data.page;
      state.pageSize = action.payload.data.pageSize;
    });

    builder.addCase(fetchProductsByStore.rejected, (state) => {
      state.Storeproducts = [];
      state.total = 0;
      state.page = 1;
      state.pageSize = 10;
    });

    

    

builder.addCase(fetchProductsListing.fulfilled, (state, action) => {
  const { data, meta } = action.payload;

  // Replace or append based on page number
  if (meta.page === 1) {
    state.products = data;
  } else {
    state.products = [...state.products, ...data];
  }

  state.total = meta.total;
  state.page = meta.page;
  state.pageSize = meta.pageSize;
});



builder.addCase(fetchProductsListing.rejected, (state) => {
  state.products = [...state.products]; // Keep existing products
  state.total = 0;
  state.page = 1;
  state.pageSize = 10;
});


  },
});
export const { resetProducts } = articleSlice.actions;
export const productSelector = (store: RootState): IProductModel[] | undefined => store.products.products;
export const productByStoreSelector = (store: RootState): IProductModel[] | undefined => store.products.Storeproducts;
export const totalProductsSelector = (store: RootState): number => store.products.total;
export const pageSelector = (store: RootState): number => store.products.page;
export const pageSizeSelector = (store: RootState): number => store.products.pageSize;
export const productListingforStore = (store: RootState): ProductsState | undefined => store.products;
export default articleSlice.reducer;
