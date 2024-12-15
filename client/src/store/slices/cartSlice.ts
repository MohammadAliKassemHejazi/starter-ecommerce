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

  // Find the existing item in the cart
  const existingItem = state.cartItems.find((item) => item.id === product.id);

  // Update the cart items
  const updatedCartItems: CartItem[] = existingItem
    ? state.cartItems.map((item) =>
        item.id === product.id ? { ...item, cartQuantity: item.cartQuantity + 1 } : item
      )
    : [...state.cartItems, { ...product, cartQuantity: 1 }];

  // Update local storage with the new cart items (optional)
  localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));

  // Return the updated cart items array
  return updatedCartItems;
});

export const decreaseCart = createAsyncThunk<
  CartItem[],
  IProductModel,
  { state: RootState }
>("cart/decreaseCart", async (product, { getState }) => {
  const state = getState().cart;
  const itemIndex = state.cartItems.findIndex((item) => item.id === product.id);

  if (itemIndex >= 0) { // Check if item exists before accessing index
    let updatedCartItems = [...state.cartItems];

    console.log(updatedCartItems[itemIndex].cartQuantity)
    
if (updatedCartItems[itemIndex].cartQuantity > 1) {
  updatedCartItems = updatedCartItems.map((item, index) =>
    index === itemIndex
      ? { ...item, cartQuantity: item.cartQuantity - 1 }
      : item
  );
} else {
  updatedCartItems = updatedCartItems.filter(
    (item) => item.id !== product.id
  );
}


    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
  
    return updatedCartItems;
  } else {
    // Handle case where item doesn't exist (optional)
    console.warn('Item not found in cart:', product.id);
    console.log('Item not found in cart:', product.id)
    return state.cartItems; // Return current state to avoid unexpected changes
  }
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

// Load Cart from Local Storage Thunk
export const loadCart = createAsyncThunk<CartItem[]>(
  "cart/loadCart",
  async () => {
    // Retrieve cart items from localStorage
    const storedCartItems = localStorage.getItem("cartItems");
    // Parse and return the stored cart items or an empty array
    return storedCartItems ? JSON.parse(storedCartItems) : [];
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

    builder.addCase(
      loadCart.fulfilled,
      (state, action: PayloadAction<CartItem[]>) => {
        state.cartItems = action.payload;
      }
    );
  },
});

export default cartSlice.reducer;
