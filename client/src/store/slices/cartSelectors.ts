import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Basic selectors
export const selectCartState = (state: RootState) => state.cart;

export const selectCartItems = (state: RootState) => state.cart.cartItems;

export const selectCartTotalQuantity = (state: RootState) => state.cart.cartTotalQuantity;

export const selectCartTotalAmount = (state: RootState) => state.cart.cartTotalAmount;

export const selectCartStatus = (state: RootState) => state.cart.status;

export const selectCartError = (state: RootState) => state.cart.error;

// Memoized selectors
export const selectCartCount = createSelector(
  [selectCartItems],
  (cartItems) => cartItems.length
);

export const selectCartItemCount = createSelector(
  [selectCartItems],
  (cartItems) => cartItems.reduce((total, item) => total + item.cartQuantity, 0)
);

// Combined selector that returns appropriate cart based on auth state
export const selectAllCartItems = createSelector(
  [selectCartItems, (state: RootState) => state.user.isAuthenticated],
  (cartItems, isAuthenticated) => {
    if (isAuthenticated) {
      return cartItems;
    } else {
      return [];
    }
  }
);

export const selectAllCartItemCount = createSelector(
  [selectAllCartItems],
  (cartItems) => cartItems.reduce((total, item) => total + item.cartQuantity, 0)
);

export const selectCartIsEmpty = createSelector(
  [selectCartItems],
  (cartItems) => cartItems.length === 0
);

export const selectCartIsLoading = createSelector(
  [selectCartStatus],
  (status) => status === 'loading'
);

export const selectCartHasError = createSelector(
  [selectCartError],
  (error) => error !== null
);
