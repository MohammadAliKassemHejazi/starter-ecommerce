import { IProductModel } from "./product.model";
import { ISizeItem } from "./size.model";

export interface CartItem extends IProductModel {

  cartQuantity: number;
  size?: String;
}