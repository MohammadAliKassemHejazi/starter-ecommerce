
import { CustomErrorParams } from "../customError"; 

export const CartNotFound : CustomErrorParams = {
  message: "Cart not found",
  code: "CART_NOT_FOUND",
  statusCode: 400,
};

 export const CartItemNotFound :CustomErrorParams = {
  message: "Item not found in cart",
  code: "CART_ITEM_NOT_FOUND",
  statusCode: 400,
};

 export const CartUpdateFailure : CustomErrorParams = {
  message: "Failed to update cart",
  code: "CART_UPDATE_FAILURE",
  statusCode: 400,
};

 export const CartClearFailure : CustomErrorParams = {
  message: "Failed to clear cart",
  code: "CART_CLEAR_FAILURE",
  statusCode: 400,
};

export default  {
  CartNotFound,
  CartItemNotFound,
  CartUpdateFailure,
  CartClearFailure,
};