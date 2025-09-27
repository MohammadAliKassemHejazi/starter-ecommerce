import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Basic selectors
export const selectCartState = (state: RootState) => state.cart;

export const selectCartItems = (state: RootState) => state.cart.cartItems;

export const selectGuestCartItems = (state: RootState) => state.cart.guestCartItems;

export const selectCartTotalQuantity = (state: RootState) => state.cart.cartTotalQuantity;

export const selectCartTotalAmount = (state: RootState) => state.cart.cartTotalAmount;

export const selectCartStatus = (state: RootState) => state.cart.status;

export const selectCartError = (state: RootState) => state.cart.error;

// Memoized selectors
export const selectCartCount = createSelector(
  [selectCartItems],
  (cartItems) => cartItems.length
);

export const selectGuestCartCount = createSelector(
  [selectGuestCartItems],
  (cartItems) => cartItems.length
);

export const selectCartItemCount = createSelector(
  [selectCartItems],
  (cartItems) => cartItems.reduce((total, item) => total + item.cartQuantity, 0)
);

export const selectGuestCartItemCount = createSelector(
  [selectGuestCartItems],
  (cartItems) => cartItems.reduce((total, item) => total + item.cartQuantity, 0)
);

// Combined selector that returns appropriate cart based on auth state
export const selectAllCartItems = createSelector(
  [selectCartItems, selectGuestCartItems, (state: RootState) => state.user.isAuthenticated, (state: RootState) => state.user.isGuest],
  (cartItems, guestCartItems, isAuthenticated, isGuest) => {
    if (isAuthenticated && !isGuest) {
      return cartItems;
    } else {
      return guestCartItems;
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

export const selectGuestCartIsEmpty = createSelector(
  [selectGuestCartItems],
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
