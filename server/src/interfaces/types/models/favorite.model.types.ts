export interface IFavoriteAttributes {
  id?: string;
  userId?: string; // ID of the user who owns the favorite list
  productId?: string; // ID of the product in the favorite list
  createdAt?: Date;
  updatedAt?: Date;
}
