import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as favoritesService from '@/services/favoritesService';
import { Favorite } from '@/services/favoritesService';

interface FavoritesState {
  favorites: Favorite[];
  loading: boolean;
  error: string | null;
  isAdding: boolean;
  isRemoving: boolean;
}

const initialState: FavoritesState = {
  favorites: [],
  loading: false,
  error: null,
  isAdding: false,
  isRemoving: false,
};

// Async thunks
export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async (_, { rejectWithValue }) => {
    try {
      const response = await favoritesService.getFavorites();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch favorites');
    }
  }
);

export const addToFavorites = createAsyncThunk(
  'favorites/addToFavorites',
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await favoritesService.addToFavorites(productId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to favorites');
    }
  }
);

export const removeFromFavorites = createAsyncThunk(
  'favorites/removeFromFavorites',
  async (productId: string, { rejectWithValue }) => {
    try {
      await favoritesService.removeFromFavorites(productId);
      return productId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from favorites');
    }
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearFavorites: (state) => {
      state.favorites = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch favorites
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action: PayloadAction<Favorite[]>) => {
        state.loading = false;
        state.favorites = action.payload;
        state.error = null;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Add to favorites
    builder
      .addCase(addToFavorites.pending, (state) => {
        state.isAdding = true;
        state.error = null;
      })
      .addCase(addToFavorites.fulfilled, (state, action: PayloadAction<Favorite>) => {
        state.isAdding = false;
        state.favorites.push(action.payload);
        state.error = null;
      })
      .addCase(addToFavorites.rejected, (state, action) => {
        state.isAdding = false;
        state.error = action.payload as string;
      });

    // Remove from favorites
    builder
      .addCase(removeFromFavorites.pending, (state) => {
        state.isRemoving = true;
        state.error = null;
      })
      .addCase(removeFromFavorites.fulfilled, (state, action: PayloadAction<string>) => {
        state.isRemoving = false;
        state.favorites = state.favorites.filter(fav => fav.productId !== action.payload);
        state.error = null;
      })
      .addCase(removeFromFavorites.rejected, (state, action) => {
        state.isRemoving = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearFavorites } = favoritesSlice.actions;

// Selectors
export const favoritesSelector = (state: { favorites: FavoritesState }) => state.favorites.favorites;
export const favoritesLoadingSelector = (state: { favorites: FavoritesState }) => state.favorites.loading;
export const favoritesErrorSelector = (state: { favorites: FavoritesState }) => state.favorites.error;
export const isAddingToFavoritesSelector = (state: { favorites: FavoritesState }) => state.favorites.isAdding;
export const isRemovingFromFavoritesSelector = (state: { favorites: FavoritesState }) => state.favorites.isRemoving;

// Helper selector to check if a product is in favorites
export const isProductInFavoritesSelector = (productId: string) => (state: { favorites: FavoritesState }) => 
  state.favorites.favorites.some(fav => fav.productId === productId);

export default favoritesSlice.reducer;
