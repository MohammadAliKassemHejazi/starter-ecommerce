import { ImageListType } from 'react-images-uploading';

export interface IStoreModel {
    id?: string;
    name: string;
    description: string;
    categoryId : string;
    photos: ImageListType;
    croppedImages: ImageListType;
    
}

export interface IStoreModelErrors {
    id?: string;
    name: string;
    description: string;
    categoryId : string;
    photos: ImageListType;
    croppedImages: string;
}

export interface IStoreResponseModel {
 id: string;
  name: string;
  description?: string;
  imgUrl: string;
  categoryId: string;
  userId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
 
}