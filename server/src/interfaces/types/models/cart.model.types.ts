export interface ICartAttributes {
  id?: string;
  userId?: string; // ID of the user who owns the cart
  tenantId?: string; // RLS tenant isolation
  cartItems?: [];
  createdAt?: Date;
  updatedAt?: Date;
}
