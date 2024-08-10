// interfaces/types/models/product.model.types.ts

import { ForeignKey } from "sequelize";
import { IUserAttributes } from "./user.model.types";
import { ICategoryAttributes } from "./category.model.types";
import { ISubcategoryAttributes } from "./subcategory.model.types";
import { IStoreAttributes } from "./store.model.types";
import { IProductImageAttributes } from "./productimage.model.types";
import { ISizeItemAttributes } from "./sizeitem.model.types";

/**
 * Interface for Product attributes.
 */
export interface IProductAttributes {
  id?: string;                          // Unique identifier for the product
  name: string;                        // Product name
  description: string;                 // Product description
  price: number;                       // Price of the product
  stockQuantity?: number;              // Optional stock quantity
  isActive?: boolean;                  // Optional active status
  ownerId?: ForeignKey<IUserAttributes['id']>; // Foreign key to owner (user)
  categoryId?: ForeignKey<ICategoryAttributes['id']>; // Foreign key to category
  subcategoryId?: ForeignKey<ISubcategoryAttributes['id']>; // Optional foreign key to subcategory
  storeId?: ForeignKey<IStoreAttributes['id']>;//  Foreign key to owner (user)
  metaTitle?: string;                  // Optional meta title for SEO
  metaDescription?: string;            // Optional meta description for SEO
  slug?: string;                       // Optional SEO friendly URL slug
  tags?: string;                       // Optional tags for the product
  discount?: number;
  croppedPhotos?: IProductImageAttributes[];
  rating?: number;
  sizes?: [ISizeItemAttributes];

}
