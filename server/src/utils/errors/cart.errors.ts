// utils/errors/cart.errors.ts
 const CartNotFound = {
  message: "Cart not found",
  code: "CART_NOT_FOUND",
  status: 404,
};

 const CartItemNotFound = {
  message: "Item not found in cart",
  code: "CART_ITEM_NOT_FOUND",
  status: 404,
};

 const CartUpdateFailure = {
  message: "Failed to update cart",
  code: "CART_UPDATE_FAILURE",
  status: 500,
};

 const CartClearFailure = {
  message: "Failed to clear cart",
  code: "CART_CLEAR_FAILURE",
  status: 500,
};

export default {
  CartNotFound,
  CartItemNotFound,
  CartUpdateFailure,
  CartClearFailure,
};