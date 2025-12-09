import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { IProductModel } from "@/models/product.model";
import { CartItem } from "@/models/cart.model";
import {
  addToCart as addToCartService,
  decreaseCart as decreaseCartService,
  removeFromCart as removeFromCartService,
  clearCart as clearCartService,
  loadCart as loadCartService,
} from "@/services/paymentService";
interface CartState {
  cartItems: CartItem[];
  cartTotalQuantity: number;
  cartTotalAmount: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CartState = {
  cartItems: [],
  cartTotalQuantity: 0,
  cartTotalAmount: 0,
  status: "idle",
  error: null,
};

// Fetch cart from the backend
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const cartItems = await loadCartService();
      return cartItems;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch cart");
    }
  }
);


export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (product: IProductModel, { rejectWithValue, dispatch, getState }) => {
    const state = getState() as { cart: CartState; user: { isAuthenticated: boolean } };
    
    // Ensure product has required fields
    if (!product.id || !product.price) {
      return rejectWithValue("Product is missing required fields (id or price)");
    }

    // If not authenticated, we shouldn't be here (UI should handle redirect),
    // but as a safeguard, just return.
    if (!state.user.isAuthenticated) {
      return rejectWithValue("User must be authenticated to add to cart");
    }

    const existingItem = state.cart.cartItems.find((item) => item.id === product.id);

    // If product.quantity is provided and greater than 1, use it; otherwise, increment existing quantity or default to 1
    const quantity = product.quantity && product.quantity > 1 ? product.quantity : (existingItem ? existingItem.cartQuantity + 1 : 1);

    // For authenticated users, use API
    if (!product.sizeId) {
      return rejectWithValue("Product is missing required field (sizeId)");
    }

    // Optimistically update the Redux state
    dispatch(
      cartSlice.actions.addToCartOptimistic({
        product,
        quantity,
      })
    );

    try {
      // Perform the backend call
      await addToCartService(product.id, quantity, product.price, product.sizeId);
      return { product, quantity, isGuest: false };
    } catch (error: any) {
      // Revert the Redux state if the backend call fails
      dispatch(
        cartSlice.actions.revertAddToCart({
          product,
          quantity,
        })
      );

      // Return the error message from the backend or a generic error
      return rejectWithValue(error.response?.data || "Failed to add to cart");
    }
  }
);

// Decrease item quantity in the cart
export const decreaseCart = createAsyncThunk(
  "cart/decreaseCart",
  async (product: IProductModel, { rejectWithValue, dispatch, getState }) => {
    const state = getState() as { cart: CartState };
    const existingItem = state.cart.cartItems.find((item) => item.id === product.id);

    if (existingItem && existingItem.cartQuantity > 1) {
      const quantity = existingItem.cartQuantity - 1;

      // Optimistically update the Redux state
      dispatch(cartSlice.actions.decreaseCartOptimistic({ product, quantity }));

      try {
        // Perform the backend call
        await decreaseCartService(product.id ?? "", quantity,product.sizeId!);
      } catch (error: any) {
        // Revert the Redux state if the backend call fails
        dispatch(cartSlice.actions.revertDecreaseCart({ product, quantity }));
        return rejectWithValue(error.response?.data || "Failed to decrease cart");
      }
    } else {
      // Optimistically remove the item from the cart
      dispatch(cartSlice.actions.removeFromCartOptimistic(product.id ?? ""));

      try {
        // Perform the backend call
        await removeFromCartService(product.id ?? "",product.sizeId!);
      } catch (error: any) {
        // Revert the Redux state if the backend call fails
        dispatch(cartSlice.actions.revertRemoveFromCart(product.id ?? ""));
        return rejectWithValue(error.response?.data || "Failed to remove from cart");
      }
    }
  }
);

// Remove item from the cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (product: IProductModel, { rejectWithValue, dispatch }) => {
    // Optimistically remove the item from the cart
    dispatch(cartSlice.actions.removeFromCartOptimistic(product.id ?? ""));

    try {
      // Perform the backend call
      await removeFromCartService(product.id ?? "",product.sizeId!);
    } catch (error: any) {
      // Revert the Redux state if the backend call fails
      dispatch(cartSlice.actions.revertRemoveFromCart(product.id ?? ""));
      return rejectWithValue(error.response?.data || "Failed to remove from cart");
    }
  }
);

// Clear the cart
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue, dispatch }) => {
    // Optimistically clear the cart
    dispatch(cartSlice.actions.clearCartOptimistic());

    try {
      // Perform the backend call
      await clearCartService();
    } catch (error: any) {
      // Revert the Redux state if the backend call fails
      dispatch(cartSlice.actions.revertClearCart());
      return rejectWithValue(error.response?.data || "Failed to clear cart");
    }
  }
);

// Calculate totals
export const getTotals = createAsyncThunk(
  "cart/getTotals",
  async (_, { getState }) => {
    const state = getState() as { cart: CartState };
    const { cartItems } = state.cart;

    let totalAmount = 0;
    let totalQuantity = 0;

    cartItems.forEach((item) => {
      totalAmount += (item?.price ?? 0) * item.cartQuantity;
      totalQuantity += item.cartQuantity;
    });

    return { totalAmount, totalQuantity };
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Optimistic updates
    addToCartOptimistic: (state, action: PayloadAction<{ product: IProductModel; quantity: number }>) => {
      const { product, quantity } = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.cartQuantity += 1;
      } else {
        state.cartItems.push({ ...product, cartQuantity: quantity });
      }
    },
    decreaseCartOptimistic: (state, action: PayloadAction<{ product: IProductModel; quantity: number }>) => {
      const { product, quantity } = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.cartQuantity = quantity;
      }
    },
    removeFromCartOptimistic: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter((item) => item.id !== action.payload);
    },
    clearCartOptimistic: (state) => {
      state.cartItems = [];
    },
    // Revert optimistic updates
    revertAddToCart: (state, action: PayloadAction<{ product: IProductModel; quantity: number }>) => {
      const { product, quantity } = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.cartQuantity -= 1;
      } else {
        state.cartItems = state.cartItems.filter((item) => item.id !== product.id);
      }
    },
    revertDecreaseCart: (state, action: PayloadAction<{ product: IProductModel; quantity: number }>) => {
      const { product, quantity } = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.cartQuantity += 1;
      }
    },
    revertRemoveFromCart: (state, action: PayloadAction<string>) => {
      // Re-add the removed item (you may need to store the removed item in a separate state for this)
    },
    revertClearCart: (state) => {
      // Restore the previous cart items (you may need to store the previous state for this)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action ) => {
        state.status = "succeeded";
        console.log("Fetched cart items:", action.payload.data.cartItems);
        state.cartItems = action.payload.data.cartItems || [];
            console.log("state.cartItems", state.cartItems);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(getTotals.fulfilled, (state, action) => {
        state.cartTotalAmount = action.payload.totalAmount;
        state.cartTotalQuantity = action.payload.totalQuantity;
      });
  },
});

export const {
  addToCartOptimistic,
  decreaseCartOptimistic,
  removeFromCartOptimistic,
  clearCartOptimistic,
  revertAddToCart,
  revertDecreaseCart,
  revertRemoveFromCart,
  revertClearCart,
} = cartSlice.actions;

export default cartSlice.reducer;