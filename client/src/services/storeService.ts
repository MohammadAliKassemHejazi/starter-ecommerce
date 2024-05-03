import {  IProductModel } from "@/models/product.model"
import httpClient from "@/utils/httpClient"
import { ImageListType } from "react-images-uploading";

export interface IProductProps {
    id?: string; // Now allows string or undefined
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

export const requestAllArticles = async () => {
	const { data: response } = await httpClient.get("/articles");
	console.log(response)
	return response.data
}

export const requestArticleByAuthor = async () => {
	const { data: response } = await httpClient.get("/articles/get/author");
	return response;
}

export const requestCreateStore = async (Store: FormData) => {
	const { data: response } = await httpClient.post("/store/create", Store)
	return response
}

export const requestUpdateArticles = async (article: IProductModel): Promise<void> => {
	const { data: response } = await httpClient.patch("/articles/update/" + article.id, article)
	return response
}

export const requestDeleteArticles = async (id: string): Promise<void> => {
	const { data: response } = await httpClient.delete("/articles/delete/" + id)
	return response
}



