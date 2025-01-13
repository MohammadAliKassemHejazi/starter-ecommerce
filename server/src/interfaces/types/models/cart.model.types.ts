export interface ICartAttributes {
  id?: string;
  userId?: string; // ID of the user who owns the cart
  cartItems?: [];
  createdAt?: Date;
  updatedAt?: Date;
}
