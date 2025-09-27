import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as favoritesService from '@/services/favoritesService';
import { Favorite } from '@/services/favoritesService';
import { localStorageService, GuestFavorite } from '@/services/localStorageService';

interface FavoritesState {
  favorites: Favorite[];
  guestFavorites: GuestFavorite[];
  loading: boolean;
  error: string | null;
  isAdding: boolean;
  isRemoving: boolean;
}

const initialState: FavoritesState = {
  favorites: [],
  guestFavorites: [],
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
  async (productId: string, { rejectWithValue, getState }) => {
    const state = getState() as { user: { isAuthenticated: boolean; isGuest: boolean } };
    
    if (state.user.isGuest) {
      // For guests, we need the product data to store locally
      return rejectWithValue('Product data required for guest favorites');
    }
    
    try {
      const response = await favoritesService.addToFavorites(productId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to favorites');
    }
  }
);

// New thunk for adding to guest favorites
export const addToGuestFavorites = createAsyncThunk(
  'favorites/addToGuestFavorites',
  async (product: any, { rejectWithValue }) => {
    try {
      localStorageService.addToGuestFavorites(product);
      return product;
    } catch (error: any) {
      return rejectWithValue('Failed to add to guest favorites');
    }
  }
);

export const removeFromFavorites = createAsyncThunk(
  'favorites/removeFromFavorites',
  async (productId: string, { rejectWithValue, getState }) => {
    const state = getState() as { user: { isAuthenticated: boolean; isGuest: boolean } };
    
    if (state.user.isGuest) {
      localStorageService.removeFromGuestFavorites(productId);
      return productId;
    }
    
    try {
      await favoritesService.removeFromFavorites(productId);
      return productId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from favorites');
    }
  }
);

// New thunk for removing from guest favorites
export const removeFromGuestFavorites = createAsyncThunk(
  'favorites/removeFromGuestFavorites',
  async (productId: string, { rejectWithValue }) => {
    try {
      localStorageService.removeFromGuestFavorites(productId);
      return productId;
    } catch (error: any) {
      return rejectWithValue('Failed to remove from guest favorites');
    }
  }
);

// New thunk for loading guest favorites
export const loadGuestFavorites = createAsyncThunk(
  'favorites/loadGuestFavorites',
  async (_, { rejectWithValue }) => {
    try {
      const guestFavorites = localStorageService.getGuestFavorites();
      return guestFavorites;
    } catch (error: any) {
      return rejectWithValue('Failed to load guest favorites');
    }
  }
);

// New thunk for syncing guest favorites to server
export const syncGuestFavorites = createAsyncThunk(
  'favorites/syncGuestFavorites',
  async (_, { rejectWithValue }) => {
    try {
      const guestFavorites = localStorageService.getGuestFavorites();
      const syncPromises = guestFavorites.map(fav => 
        favoritesService.addToFavorites(fav.productId)
      );
      
      await Promise.all(syncPromises);
      localStorageService.clearGuestFavorites();
      return guestFavorites.length;
    } catch (error: any) {
      return rejectWithValue('Failed to sync guest favorites');
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
      state.guestFavorites = [];
      state.loading = false;
      state.error = null;
    },
    clearGuestFavorites: (state) => {
      state.guestFavorites = [];
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

    // Guest favorites actions
    builder
      .addCase(addToGuestFavorites.fulfilled, (state, action) => {
        const existingIndex = state.guestFavorites.findIndex(fav => fav.productId === action.payload.id);
        if (existingIndex === -1) {
          state.guestFavorites.push({
            productId: action.payload.id,
            product: action.payload,
            addedAt: new Date().toISOString()
          });
        }
      })
      .addCase(removeFromGuestFavorites.fulfilled, (state, action) => {
        state.guestFavorites = state.guestFavorites.filter(fav => fav.productId !== action.payload);
      })
      .addCase(loadGuestFavorites.fulfilled, (state, action) => {
        state.guestFavorites = action.payload;
      })
      .addCase(syncGuestFavorites.fulfilled, (state) => {
        state.guestFavorites = [];
      });
  },
});

export const { clearError, clearFavorites, clearGuestFavorites } = favoritesSlice.actions;

// Selectors
export const favoritesSelector = (state: { favorites: FavoritesState }) => state.favorites.favorites;
export const guestFavoritesSelector = (state: { favorites: FavoritesState }) => state.favorites.guestFavorites;
export const favoritesLoadingSelector = (state: { favorites: FavoritesState }) => state.favorites.loading;
export const favoritesErrorSelector = (state: { favorites: FavoritesState }) => state.favorites.error;
export const isAddingToFavoritesSelector = (state: { favorites: FavoritesState }) => state.favorites.isAdding;
export const isRemovingFromFavoritesSelector = (state: { favorites: FavoritesState }) => state.favorites.isRemoving;

// Helper selector to check if a product is in favorites (works for both authenticated and guest)
export const isProductInFavoritesSelector = (productId: string) => (state: { favorites: FavoritesState; user: { isAuthenticated: boolean; isGuest: boolean } }) => {
  if (state.user.isAuthenticated && !state.user.isGuest) {
    return state.favorites.favorites.some(fav => fav.productId === productId);
  } else {
    return state.favorites.guestFavorites.some(fav => fav.productId === productId);
  }
};

// Combined favorites selector (returns appropriate favorites based on auth state)
export const allFavoritesSelector = (state: { favorites: FavoritesState; user: { isAuthenticated: boolean; isGuest: boolean } }) => {
  if (state.user.isAuthenticated && !state.user.isGuest) {
    return state.favorites.favorites;
  } else {
    return state.favorites.guestFavorites;
  }
};

export default favoritesSlice.reducer;
