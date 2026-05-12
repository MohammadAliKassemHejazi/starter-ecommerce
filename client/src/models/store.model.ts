import { ImageListType } from 'react-images-uploading';
import { IStore } from '@shared/types/store.types';

// Re-export shared entity as the canonical response model
export type { IStore } from '@shared/types/store.types';
export type IStoreResponseModel = IStore;

// UI-only form model (used in store create/edit forms with image upload)
export interface IStoreModel {
  id?: string;
  storeId?: string;
  name: string;
  description: string;
  categoryId: string;
  photos?: ImageListType;
  croppedImages: ImageListType;
  productImages?: ImageListType;
  imgUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  isActive?: boolean;
}

export interface IStoreModelErrors {
  id?: string;
  storeId?: string;
  name: string;
  description: string;
  categoryId: string;
  photos?: ImageListType;
  croppedImages: string;
  productImages?: string;
}
