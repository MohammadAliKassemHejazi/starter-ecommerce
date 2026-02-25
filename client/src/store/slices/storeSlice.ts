import { StoresState } from "@/interfaces/types/store/slices/storeSlice.types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as storeService from "@/services/storeService";

import { RootState } from "../store";
import { IStoreResponseModel } from "@/models/store.model";
import { CreateStoreResponse } from "@/interfaces/api/store.types";

const initialState: StoresState = {
  stores: [],
  store: undefined,
  error: "",
};

export const fetchStoreById = createAsyncThunk(
  "store/by-id",
  async (id: string) => {
    const { data: response } = await storeService.requestStoreById(id);
    console.log(response, " response from storeSlice");
    return response.store;
  }
);

export const updateStoreImages = createAsyncThunk(
  "requestUpdateStoreImage/update",
  async (Images: FormData) => {
    const response = await storeService.requestUpdateStoreImage(Images);
    return response;
  }
);

export const fetchAllStoresForUser = createAsyncThunk(
  "store/fetch",
  async () => {
    const response = await storeService.requestAllStoresForUser();
    return response;
  }
);

export const fetchAllStores = createAsyncThunk(
  "store/fetch/all",
  async () => {
    const response = await storeService.requestAllStores();
    console.log(response, " all stores response");
    return response.data;
  }
);

// store/storeThunks.ts or wherever your thunks live


export const fetchAllStoresWithFilter = createAsyncThunk(
  'store/fetch-with-filter',
  async ({
    page,
    pageSize,
    searchQuery = '',
    orderBy = '',
  }: {
    page: number;
    pageSize: number;
    searchQuery?: string;
    orderBy?: string;
  }) => {
    const response = await storeService.requestAllStoresForUserWithFilter(
      page,
      pageSize,
      searchQuery,
      orderBy
    );

    return response.data;
  }
);

export const createStore = createAsyncThunk(
  "store/create",
  async (store: FormData) => {
    const response: CreateStoreResponse = await storeService.requestCreateStore(store);
    return response;
  }
);

export const updateStore = createAsyncThunk(
  "store/Update",
  async (store: FormData) => {
    const response: CreateStoreResponse = await storeService.requestUpdateStore(store);
    return response;
  }
);



export const deleteStore = createAsyncThunk(
  "store/delete",
  async (id: string) => {
    const response = await storeService.requestDeleteStore(id);
    return response;
  }
);

export const deleteStoreImage = createAsyncThunk(
  "store/delete/image",
  async (id: string) => {
    const response = await storeService.requestDeleteStoreImage(id);
    return response;
  }
);

const storeSlice = createSlice({
  name: "store",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllStoresWithFilter.fulfilled, (state, action) => {
        console.log(action.payload, " filtered stores payload");
    state.stores = action.payload.stores || [];
})
.addCase(fetchAllStoresWithFilter.rejected, (state, action) => {
  state.error = action.error.message || "Failed to fetch filtered stores.";
  state.stores = [];
})
      .addCase(fetchStoreById.fulfilled, (state, action) => {

        state.store = action.payload;
      })
      .addCase(fetchStoreById.rejected, (state, action) => {
        
        state.error = action.error.message || "Failed to fetch store.";
        state.store = undefined;
      })
      .addCase(fetchAllStoresForUser.fulfilled, (state, action) => {
        state.stores = action.payload.data;
      })
      .addCase(fetchAllStoresForUser.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch stores.";
        state.stores = [];
      })
      .addCase(fetchAllStores.fulfilled, (state, action) => {
       
        state.stores = action.payload;
      })
      .addCase(fetchAllStores.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch stores.";
        state.stores = [];
      })
      .addCase(createStore.fulfilled, (state, action) => {
        state.stores?.push(action.payload.data);  // Add the new store to the list
      })
      .addCase(createStore.rejected, (state, action) => {
        state.error = action.error.message || "Failed to create store.";
      })
      .addCase(deleteStore.rejected, (state, action) => {
        state.error = action.error.message || "Failed to delete store.";
      })
      .addCase(deleteStoreImage.fulfilled, (state, action) => {
        if (state.store && state.store.id === action.meta.arg) {
          state.store.imgUrl = "";
        }
      })
      .addCase(deleteStoreImage.rejected, (state, action) => {
        state.error = action.error.message || "Failed to delete store image.";
      });
  },
});

export const storeSelector = (store: RootState): IStoreResponseModel[] | undefined => store.store.stores;
export const singleStoreSelector = (store: RootState): IStoreResponseModel | undefined => store.store.store;

export default storeSlice.reducer;
