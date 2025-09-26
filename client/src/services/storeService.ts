import {  IProductModel } from "@/models/product.model"
import httpClient from "@/utils/httpClient"
import { ImageListType } from "react-images-uploading";
import { 
	StoreResponse, 
	StoresListResponse, 
	CreateStoreResponse, 
	UpdateStoreResponse, 
	DeleteStoreResponse 
} from "@/interfaces/api/store.types";

export interface IProductProps {
    id?: string; // Now allows string or undefined
    name: string;
    description: string;
    price: number;
    stockQuantity?: number; // Can be number or undefined
    isActive?: boolean; // Can be boolean or undefined
    photos: ImageListType;
}

export const requestStoreById = async (id: string): Promise<StoreResponse> => {
	const { data: response } = await httpClient.get<StoreResponse>(
		`/store/get?id=${id}`
	)
	return response
}

export const requestAllStoresForUser = async (): Promise<StoresListResponse> => {
	const { data: response } = await httpClient.get<StoresListResponse>("/store/getall/user");
	return response
}

export const requestAllStores = async (): Promise<StoresListResponse> => {
	const { data: response } = await httpClient.get<StoresListResponse>("/store/getall");
	return response
}

export const requestCreateStore = async (Store: FormData): Promise<CreateStoreResponse> => {
	const { data: response } = await httpClient.post<CreateStoreResponse>("/store/create", Store)
	return response
}

export const requestUpdateStoreImage = async (Store: FormData): Promise<UpdateStoreResponse> => {
	const { data: response } = await httpClient.patch<UpdateStoreResponse>("/store/update/image", Store)
	return response
}

export const requestUpdateStore = async (Store: FormData): Promise<UpdateStoreResponse> => {
	const { data: response } = await httpClient.post<UpdateStoreResponse>("/store/update", Store)
	return response
}

export const requestDeleteStore = async (id: string): Promise<DeleteStoreResponse> => {
	const { data: response } = await httpClient.delete<DeleteStoreResponse>("/store/delete/" + id)
	return response
}



