import  { ImageListType } from 'react-images-uploading';

export interface IProductModel {
    id?: string;
    name: string;
    description: string;
    price: number;
    stockQuantity?: number;
    isActive?: boolean;
    photos: ImageListType;
  }