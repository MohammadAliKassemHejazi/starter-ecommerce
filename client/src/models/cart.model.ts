import { IProductModel } from "./product.model";

export interface CartItem extends IProductModel {
  cartItemId: string; // unique identifier for the item in cart
  quantity: number;
  sizeId?: string;
  size?: any;
}
