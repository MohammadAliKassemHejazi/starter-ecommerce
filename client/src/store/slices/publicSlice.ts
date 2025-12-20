import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as publicService from "@/services/publicService";
import { requestAllPackages as getAllPackagesService, IPackage } from "@/services/packageService";
import { RootState } from "../store";
import { IStoreResponseModel } from "@/models/store.model";
import { IProductModel } from "@/models/product.model";

interface PublicState {
  stores: IStoreResponseModel[];
  products: IProductModel[];
  categories: any[];
  packages: IPackage[];
  loading: {
    stores: boolean;
    products: boolean;
    categories: boolean;
    packages: boolean;
  };
  error: {
    stores: string | null;
    products: string | null;
    categories: string | null;
    packages: string | null;
  };
  pagination: {
    products: {
      page: number;
      pageSize: number;
      total: number;
      hasMore: boolean;
    };
  };
}

const initialState: PublicState = {
  stores: [],
  products: [],
  categories: [],
  packages: [],
  loading: {
    stores: false,
    products: false,
    categories: false,
    packages: false,
  },
  error: {
    stores: null,
    products: null,
    categories: null,
    packages: null,
  },
  pagination: {
    products: {
      page: 1,
      pageSize: 10,
      total: 0,
      hasMore: true,
    },
  },
};


// Async thunks for public data
export const fetchPublicStores = createAsyncThunk(
  "public/fetchStores",
  async () => {
    const response = await publicService.getPublicStores();
   console.log(response.data)
   return response.data
  }
);

export const fetchPublicProducts = createAsyncThunk(
  "public/fetchProducts",
  async ({ page = 1, pageSize = 10 }: { page?: number; pageSize?: number } = {}) => {
    const response = await publicService.getPublicProducts(page, pageSize);
    return {
      products: response.data,
      pagination: response.meta,
    };
  }
);

export const fetchPublicCategories = createAsyncThunk(
  "public/fetchCategories",
  async () => {
    const response = await publicService.getPublicCategories();
    return response.data;
  }
);

export const loadMorePublicProducts = createAsyncThunk(
  "public/loadMoreProducts",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const { page, pageSize } = state.public.pagination.products;
    const nextPage = page + 1;
    
    const response = await publicService.getPublicProducts(nextPage, pageSize);
    return {
      products: response.data,
      pagination: response.meta,
      page: nextPage,
    };
  }
);

export const getAllPackages = createAsyncThunk(
  "public/getAllPackages",
  async () => {
    const response = await getAllPackagesService();
    return response.data;
  }
);

const publicSlice = createSlice({
  name: "public",
  initialState,
  reducers: {
    resetPublicProducts: (state) => {
      state.products = [];
      state.pagination.products = {
        page: 1,
        pageSize: 10,
        total: 0,
        hasMore: true,
      };
    },
    clearPublicErrors: (state) => {
      state.error = {
        stores: null,
        products: null,
        categories: null,
        packages: null,
      };
    },
  },
  extraReducers: (builder) => {
    // Fetch public stores
    builder
      .addCase(fetchPublicStores.pending, (state) => {
        state.loading.stores = true;
        state.error.stores = null;
      })
      .addCase(fetchPublicStores.fulfilled, (state, action) => {
        state.loading.stores = false;
        console.log("Fetched stores:", action.payload);
        state.stores = action.payload || [];
      })
      .addCase(fetchPublicStores.rejected, (state, action) => {
        state.loading.stores = false;
        state.error.stores = action.error.message || "Failed to fetch stores";
      });

    // Fetch public products
    builder
      .addCase(fetchPublicProducts.pending, (state) => {
        state.loading.products = true;
        state.error.products = null;
      })
      .addCase(fetchPublicProducts.fulfilled, (state, action) => {
        state.loading.products = false;
        // Handle different response formats
        if (action.payload.products && action.payload.pagination) {
          // Expected format with products and pagination
          state.products = action.payload.products;
          state.pagination.products = {
            page: action.payload.pagination.page,
            pageSize: action.payload.pagination.pageSize,
            total: action.payload.pagination.total,
            hasMore: action.payload.pagination.page < action.payload.pagination.totalPages,
          };
        } else if (action.payload.products) {
          // Backend returns { message: results } format
          state.products = Array.isArray(action.payload.products) ? action.payload.products : [];
          state.pagination.products = {
            page: 1,
            pageSize: 10,
            total: state.products.length,
            hasMore: false,
          };
        } else {
          // Fallback for unexpected format
          state.products = [];
          state.pagination.products = {
            page: 1,
            pageSize: 10,
            total: 0,
            hasMore: false,
          };
        }
      })
      .addCase(fetchPublicProducts.rejected, (state, action) => {
        state.loading.products = false;
        state.error.products = action.error.message || "Failed to fetch products";
      });

    // Load more public products
    builder
      .addCase(loadMorePublicProducts.pending, (state) => {
        state.loading.products = true;
      })
      .addCase(loadMorePublicProducts.fulfilled, (state, action) => {
        state.loading.products = false;
        state.products = [...state.products, ...action.payload.products];
        state.pagination.products = {
          page: action.payload.page,
          pageSize: action.payload.pagination.pageSize,
          total: action.payload.pagination.total,
          hasMore: action.payload.page < action.payload.pagination.totalPages,
        };
      })
      .addCase(loadMorePublicProducts.rejected, (state, action) => {
        state.loading.products = false;
        state.error.products = action.error.message || "Failed to load more products";
      });

    // Fetch public categories
    builder
      .addCase(fetchPublicCategories.pending, (state) => {
        state.loading.categories = true;
        state.error.categories = null;
      })
      .addCase(fetchPublicCategories.fulfilled, (state, action) => {
        state.loading.categories = false;
        state.categories = action.payload;
      })
      .addCase(fetchPublicCategories.rejected, (state, action) => {
        state.loading.categories = false;
        state.error.categories = action.error.message || "Failed to fetch categories";
      });

    // Get all packages
    builder
      .addCase(getAllPackages.pending, (state) => {
        state.loading.packages = true;
        state.error.packages = null;
      })
      .addCase(getAllPackages.fulfilled, (state, action) => {
        state.loading.packages = false;
        state.packages = action.payload;
      })
      .addCase(getAllPackages.rejected, (state, action) => {
        state.loading.packages = false;
        state.error.packages = action.error.message || "Failed to fetch packages";
      });
  },
});

export const { resetPublicProducts, clearPublicErrors } = publicSlice.actions;

// Selectors
export const selectPublicStores = (state: RootState) => state.public.stores;
export const selectPublicProducts = (state: RootState) => state.public.products;
export const selectPublicCategories = (state: RootState) => state.public.categories;
export const selectPublicPackages = (state: RootState) => state.public.packages;
export const selectPublicLoading = (state: RootState) => state.public.loading;
export const selectPublicErrors = (state: RootState) => state.public.error;
export const selectPublicPagination = (state: RootState) => state.public.pagination;

export default publicSlice.reducer;
