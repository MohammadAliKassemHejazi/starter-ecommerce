import { IProductModel } from "./product.model";

export interface CartItem extends IProductModel {

  cartQuantity: number;
}