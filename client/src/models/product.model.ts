import { ImageListType } from 'react-images-uploading';

// Re-export shared entity and related types as the canonical models
export type { IProduct, IProductImage, ISizeItem } from '@shared/types/product.types';

// UI-only form model (used in product create/edit forms with image upload)
export interface IProductFormModel {
  id?: string;
  name?: string;
  description?: string;
  price?: number;
  originalPrice?: number;
  discount?: number;
  stockQuantity?: number;
  isActive?: boolean;
  subcategoryId?: string;
  categoryId?: string;
  storeId?: string;
  ownerId?: string;
  thumbnail?: string;
  metaTitle?: string;
  metaDescription?: string;
  photos?: ImageListType;
  productImages?: any;
  sizeItems?: Array<{ sizeId: string; quantity: number; size?: { size: string } }>;
}

export interface IProductModelErrors {
  id?: string;
  name: string;
  description: string;
  price: string;
  stockQuantity?: string;
  isActive?: string;
  subcategoryId?: string;
  storeId?: string;
  ownerId?: string;
  metaTitle?: string;
  metaDescription?: string;
  photos: string;
  productImages: string;
}
