import {  IProductModel } from "@/models/product.model"
import httpClient from "@/utils/httpClient"
import { ImageListType } from "react-images-uploading";

export interface IProductProps {
    id?: string; // Can be string or undefined
    name: string;
    description: string;
    price: number;
    stockQuantity?: number; // Can be number or undefined
    isActive?: boolean; // Can be boolean or undefined
    photos: ImageListType;
}

export const requestProductById = async (id: string) => {
	const { data: response } = await httpClient.get(
		`/shop/get?id=${id}`
	)
	return response
}

export const requestAllProductID = async () => {
	const { data: response } = await httpClient.get("/shop/getall");
	console.log(response)
	return response.data
}

export const requestArticleByAuthor = async () => {
	const { data: response } = await httpClient.get("/articles/get/author");
	return response;
}

export const requestCreateProducts = async (Product: FormData) => {
	const { data: response } = await httpClient.post("/shop/create", Product)
	return response
}

export const requestUpdateArticles = async (Product: FormData): Promise<void> => {
	const { data: response } = await httpClient.patch("/articles/update" , Product)
	return response
}

export const requestDeleteArticles = async (id: string): Promise<void> => {
	const { data: response } = await httpClient.delete("/articles/delete/" + id)
	return response
}



