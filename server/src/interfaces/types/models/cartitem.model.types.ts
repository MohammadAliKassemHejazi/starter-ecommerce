export interface ICartItemAttributes {
  id?: string;
  cartId?: string; // ID of the cart associated with the item
  productId?: string; // ID of the product associated with the item
  quantity: number; // Quantity of the product in the cart item
  createdAt?: Date;
  updatedAt?: Date;
}

