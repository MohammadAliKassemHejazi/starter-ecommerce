export interface IFavoriteItemAttributes {
  id?: string;
  favoriteId?: string; // ID of the favorite associated with the item
  productId?: string; // ID of the product associated with the item
  createdAt?: Date;
  updatedAt?: Date;
}
