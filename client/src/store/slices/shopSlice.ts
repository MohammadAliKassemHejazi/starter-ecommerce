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
  loading: false,
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
    return response.data;
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

export const shopSlice = createSlice({
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
      // Cast payload to any to handle type mismatches
      const payload = action.payload as any;
      state.product = payload.data || payload;
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
      const payload = action.payload as any;
      const data = payload.data || payload;
      state.Storeproducts = data.products;
      state.total = data.total;
      state.page = data.page;
      state.pageSize = data.pageSize;
    });

    builder.addCase(fetchProductsByStore.rejected, (state) => {
      state.Storeproducts = [];
      state.total = 0;
      state.page = 1;
      state.pageSize = 10;
    });

    

    

builder.addCase(fetchProductsListing.pending, (state) => {
  state.loading = true;
  state.error = "";
});

builder.addCase(fetchProductsListing.fulfilled, (state, action) => {
  state.loading = false;
  // Unwrap the data from the response (which might be wrapped by httpClient)
  const payload = action.payload as any;
  const payloadData = payload.data || payload;
  const { products, total, page, pageSize } = payloadData;

  // Replace or append based on page number
  if (page === 1) {
    state.products = products || [];
  } else {
    state.products = [...state.products, ...(products || [])];
  }

  state.total = total || 0;
  state.page = page || 1;
  state.pageSize = pageSize || 10;
});

builder.addCase(fetchProductsListing.rejected, (state, action) => {
  state.loading = false;
  state.error = action.error.message || "Failed to fetch products";
  // We keep existing products/state in case of error, or could reset if needed
});


  },
});
export const { resetProducts } = shopSlice.actions;
export const productSelector = (store: RootState): IProductModel[] | undefined => store.products.products;
export const productByStoreSelector = (store: RootState): IProductModel[] | undefined => store.products.Storeproducts;
export const totalProductsSelector = (store: RootState): number => store.products.total;
export const pageSelector = (store: RootState): number => store.products.page;
export const pageSizeSelector = (store: RootState): number => store.products.pageSize;
export const selectShopLoading = (store: RootState): boolean => store.products.loading;
export const productListingforStore = (store: RootState): ProductsState | undefined => store.products;
export default shopSlice.reducer;
