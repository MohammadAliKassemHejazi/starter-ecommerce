import { ImageListType } from "react-images-uploading";
import { IStoreModel } from "./store.model";
import { IComment } from "./comment.model";
import { ISize } from "./size.model";

export interface IProductModel {
  id?: string;
  name?: string;
  description?: string;
  price?: number;
  stockQuantity?: number;
  isActive?: boolean;
  subcategoryId?: string;
  categoryId?:string;
  storeId?: string;
  metaTitle?: string;
  metaDescription?: string; 
  photos?: ImageListType;
  croppedPhotos?: ImageListType;
  store? : IStoreModel;
  ratings ?:  number;
  commentsCount? :   number;
  comments ?: [IComment];
  sizes ?: [ISize];
}

export interface productresponse {
product : IProductModel
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