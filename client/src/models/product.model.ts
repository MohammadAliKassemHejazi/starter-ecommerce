import { ImageListType } from "react-images-uploading";

export interface IProductModel {
  id?: string;
  name: string;
  description: string;
  price: number;
  stockQuantity?: number;
  isActive?: boolean;
  subcategoryId?: string;
  storeId?: string;
  metaTitle?: string;
  metaDescription?: string; 
  photos: ImageListType;
  croppedPhotos: ImageListType;
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
    metaTitle?: string; 
    metaDescription?: string;
    photos: string;
    croppedPhotos: string;
  }