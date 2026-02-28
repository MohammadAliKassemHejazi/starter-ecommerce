import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as publicService from "@/services/publicService";
import { requestAllPackages as getAllPackagesService, IPackage } from "@/services/packageService";
import { RootState } from "../store";
import { IStoreResponseModel } from "@/models/store.model";
import { IProductModel } from "@/models/product.model";
import { IArticleModelWithUser } from "@/models/article.model";
import { Cast } from "lucide-react";
import { ICategories } from "@/models/utils.model";

interface PublicState {
  stores: IStoreResponseModel[];
  products: IProductModel[];
  articles: IArticleModelWithUser[];
  categories: ICategories[];
  packages: IPackage[];
  loading: {
    stores: boolean;
    products: boolean;
    articles: boolean;
    categories: boolean;
    packages: boolean;
  };
  error: {
    stores: string | null;
    products: string | null;
    articles: string | null;
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
  articles: [],
  categories: [],
  packages: [],
  loading: {
    stores: false,
    products: false,
    articles: false,
    categories: false,
    packages: false,
  },
  error: {
    stores: null,
    products: null,
    articles: null,
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



export const fetchPublicCategories = createAsyncThunk(
  "public/fetchCategories",
  async () => {
    const response = await publicService.getPublicCategories();
    return response.data;
  }
);

export const fetchPublicArticles = createAsyncThunk(
  "public/fetchArticles",
  async () => {
    const response = await publicService.getPublicArticles();

    return response.data;
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
        articles : null
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
        state.stores = (action.payload || []) as IStoreResponseModel[];
      })
      .addCase(fetchPublicStores.rejected, (state, action) => {
        state.loading.stores = false;
        state.error.stores = action.error.message || "Failed to fetch stores";
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

    // Fetch public articles
    builder
      .addCase(fetchPublicArticles.pending, (state) => {
        state.loading.articles = true;
        state.error.articles = null;
      })
      .addCase(fetchPublicArticles.fulfilled, (state, action) => {
        state.loading.articles = false;
        state.articles = action.payload || [];
      })
      .addCase(fetchPublicArticles.rejected, (state, action) => {
        state.loading.articles = false;
        state.error.articles = action.error.message || "Failed to fetch articles";
      });
  },
});

export const { resetPublicProducts, clearPublicErrors } = publicSlice.actions;

// Selectors
export const selectPublicStores = (state: RootState) => state.public.stores;
export const selectPublicProducts = (state: RootState) => state.public.products;
export const selectPublicArticles = (state: RootState) => state.public.articles;
export const selectPublicCategories = (state: RootState) => state.public.categories;
export const selectPublicPackages = (state: RootState) => state.public.packages;
export const selectPublicLoading = (state: RootState) => state.public.loading;
export const selectPublicErrors = (state: RootState) => state.public.error;
export const selectPublicPagination = (state: RootState) => state.public.pagination;

export default publicSlice.reducer;
