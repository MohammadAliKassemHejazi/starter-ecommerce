import { ImageListType } from 'react-images-uploading';

export interface IStoreModel {
    id?: string;
    name: string;
    description: string;
    
    photos: ImageListType;
    croppedImages: ImageListType;
}

export interface IStoreModelErrors {
    id?: string;
    name: string;
    description: string;
   
        photos: ImageListType;
    croppedImages: string;
}
