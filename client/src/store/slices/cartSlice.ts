import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store"; // Import RootState if it's already defined
import { IProductModel } from "@/models/product.model";
import { CartItem } from "@/models/cart.model";
interface CartState {
  cartItems: CartItem[];
  cartTotalQuantity: number;
  cartTotalAmount: number;
}

// Initial state
const initialState: CartState = {
  cartItems:  [],
  cartTotalQuantity: 0,
  cartTotalAmount: 0,
};

// Add to Cart Thunk
export const addToCart = createAsyncThunk<
  CartItem[],
  IProductModel,
  { state: RootState }
>("cart/addToCart", async (product, { getState }) => {
  const state = getState().cart;
  const existingIndex = state.cartItems.findIndex(
    (item) => item.id === product.id
  );

  let updatedCartItems: CartItem[];

  if (existingIndex >= 0) {
    updatedCartItems = [...state.cartItems];
    updatedCartItems[existingIndex] = {
      ...updatedCartItems[existingIndex],
      cartQuantity: updatedCartItems[existingIndex].cartQuantity + 1,
    };
  } else {
    const tempProductItem = { ...product, cartQuantity: 1 };
    updatedCartItems = [...state.cartItems, tempProductItem];
  }

  localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
  return updatedCartItems;
});

// Decrease Cart Item Quantity Thunk
export const decreaseCart = createAsyncThunk<
  CartItem[],
  IProductModel,
  { state: RootState }
>("cart/decreaseCart", async (product, { getState }) => {
  const state = getState().cart;
  const itemIndex = state.cartItems.findIndex((item) => item.id === product.id);
  let updatedCartItems = [...state.cartItems];

  if (updatedCartItems[itemIndex].cartQuantity > 1) {
    updatedCartItems[itemIndex].cartQuantity -= 1;
  } else {
    updatedCartItems = updatedCartItems.filter(
      (item) => item.id !== product.id
    );
  }

  localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
  return updatedCartItems;
});

// Remove from Cart Thunk
export const removeFromCart = createAsyncThunk<
  CartItem[],
  IProductModel,
  { state: RootState }
>("cart/removeFromCart", async (product, { getState }) => {
  const state = getState().cart;
  const updatedCartItems = state.cartItems.filter(
    (item) => item.id !== product.id
  );
  localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));

  return updatedCartItems;
});

// Define the getTotals reducer
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

// Clear Cart Thunk
export const clearCart = createAsyncThunk<CartItem[]>(
  "cart/clearCart",
  async () => {
    localStorage.setItem("cartItems", JSON.stringify([]));
    return [];
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      addToCart.fulfilled,
      (state, action: PayloadAction<CartItem[]>) => {
        state.cartItems = action.payload;
      }
    );
    builder.addCase(
      decreaseCart.fulfilled,
      (state, action: PayloadAction<CartItem[]>) => {
        state.cartItems = action.payload;
      }
    );
    builder.addCase(
      removeFromCart.fulfilled,
      (state, action: PayloadAction<CartItem[]>) => {
        state.cartItems = action.payload;
      }
    );
    builder.addCase(
      clearCart.fulfilled,
      (state, action: PayloadAction<CartItem[]>) => {
        state.cartItems = action.payload;
      }
    );
    builder.addCase(getTotals.fulfilled, (state, action) => {
      state.cartTotalAmount = action.payload.totalAmount;
      state.cartTotalQuantity = action.payload.totalQuantity;
    });
  },
});

export default cartSlice.reducer;
