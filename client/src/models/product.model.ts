import { ImageListType } from "react-images-uploading";
import { IStoreModel } from "./store.model";
import { IComment } from "./comment.model";
import { ISizeItem } from "./size.model";
import { ReactNode } from "react";

export interface IProductModel {
  originalPrice: ReactNode;
  id?: string;
  name?: string;
  tagColor?: string;
  description?: string;
  price?: number;
  discount?: number;
  stockQuantity?: number;
  isActive?: boolean;
  subcategoryId?: string;
  categoryId?:string;
  storeId?: string;
  metaTitle?: string;
  metaDescription?: string; 
  photos?: ImageListType;
  ProductImages?: ImageListType;
  store? : IStoreModel;
  ratings ?:  number;
  commentsCount? :   number;
  comments ?: IComment[];
  SizeItems?: ISizeItem[];
  quantity?: number;
  sizeId?: string;
  updatedAt?: string;
  createdAt?: string;
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
    ProductImages: string;
  }