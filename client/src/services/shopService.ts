
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

	return response.data
}

export const requestProductsByStore = async ( storeId: string, page: number, pageSize: number ) => {
  const { data: response } = await httpClient.get(`/shop/get/storeProducts/${storeId}?page=${page}&pageSize=${pageSize}`);
  return response;
};

export const requestProductsListing = async ( page: number, pageSize: number ) => {
  const { data: response } = await httpClient.get(`/shop/get/productListing/?page=${page}&pageSize=${pageSize}`);
  return response;
};


export const requestCreateProducts = async (Product: FormData): Promise<any> => {
	const { data: response } = await httpClient.post("/shop/create", Product)
	return response
}

export const requestUpdateArticles = async (Product: FormData): Promise<any> => {
	const { data: response } = await httpClient.patch("/articles/update" , Product)
	return response
}

export const requestDeleteProduct = async (id: string): Promise<void> => {
	const { data: response } = await httpClient.delete("/shop/delete/" + id)
	return response
}

export const requestDeleteProductImage = async (id: string): Promise<void> => {
	const { data: response } = await httpClient.delete("/shop/delete/image" + id)
	return response
}



