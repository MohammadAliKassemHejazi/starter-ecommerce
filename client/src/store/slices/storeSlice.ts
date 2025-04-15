import { StoresState } from "@/interfaces/types/store/slices/storeSlice.types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as storeService from "@/services/storeService";

import { RootState } from "../store";
import { IStoreResponseModel } from "@/models/store.model";

const initialState: StoresState = {
  stores: [],
  store: undefined,
  error: "",
};

export const fetchStoreById = createAsyncThunk(
  "store/by-id",
  async (id: string) => {
    const { store: response } = await storeService.requestStoreById(id);
    console.log(response, " response from storeSlice");
    return response;
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
    return response;
  }
);

export const fetchAllStoresWithFilter = createAsyncThunk(
  "store/fetch",
  async ({ searchQuery, page, pageSize }: { searchQuery: string, page: number, pageSize: number })=> {
    const response = await storeService.requestAllStores();
    return response;
  }
);

export const createStore = createAsyncThunk(
  "store/create",
  async (store: FormData) => {
    const response: IStoreResponseModel = await storeService.requestCreateStore(store);
    return response;
  }
);

export const updateStore = createAsyncThunk(
  "store/Update",
  async (store: FormData) => {
    const response: IStoreResponseModel = await storeService.requestUpdateStore(store);
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

const storeSlice = createSlice({
  name: "store",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStoreById.fulfilled, (state, action) => {

        state.store = action.payload;
      })
      .addCase(fetchStoreById.rejected, (state, action) => {
        
        state.error = action.error.message || "Failed to fetch store.";
        state.store = undefined;
      })
      .addCase(fetchAllStoresForUser.fulfilled, (state, action) => {
        state.stores = action.payload.stores;
      })
      .addCase(fetchAllStoresForUser.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch stores.";
        state.stores = [];
      })
         .addCase(fetchAllStores.fulfilled, (state, action) => {
        state.stores = action.payload.stores;
      })
      .addCase(fetchAllStores.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch stores.";
        state.stores = [];
      })
      .addCase(createStore.fulfilled, (state, action) => {
        state.stores?.push(action.payload);  // Add the new store to the list
      })
      .addCase(createStore.rejected, (state, action) => {
        state.error = action.error.message || "Failed to create store.";
      })
      .addCase(deleteStore.rejected, (state, action) => {
        state.error = action.error.message || "Failed to delete store.";
      });
  },
});

export const storeSelector = (store: RootState): IStoreResponseModel[] | undefined => store.store.stores;
export const singleStoreSelector = (store: RootState): IStoreResponseModel | undefined => store.store.store;

export default storeSlice.reducer;
