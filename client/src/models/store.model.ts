import { ImageListType } from 'react-images-uploading';

export interface IStoreModel {
    id?: string;
    storeId?: string;
    name: string;
    description: string;
    categoryId : string;
    photos?: ImageListType;
    croppedImages: ImageListType;
    productImages?: ImageListType;
}

export interface IStoreModelErrors {
    id?: string;
    storeId?: string;
    name: string;
    description: string;
    categoryId : string;
    photos?: ImageListType;
    croppedImages: string;
    productImages?: string;
}

export interface IStoreResponseModel {
  id: string;
  name: string;
  description?: string;
  imgUrl: string;
  categoryId: string;
  userId?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  metaTitle?: string;
  metaDescription?: string;
}