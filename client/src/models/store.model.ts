import { ImageListType } from 'react-images-uploading';

export interface IStoreModel {
    id?: string;
    name: string;
    description: string;
    categoryId : number;
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
    createdAt?: string | number | Date  | undefined;
    id?: string;
    name: string;
    description: string;
    categoryId : string;
    imgUrl: string;
}