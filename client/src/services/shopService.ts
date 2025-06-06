
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


export const paymentService = {
  createPayment: async ({ amount, currency, paymentMethodId }: { amount: number; currency: string; paymentMethodId: string }) => {
    console.log({ amount, currency, paymentMethodId }, "charge");

    const { data } = await httpClient.post('/payment/charge', {
      amount,
      currency,
      paymentMethodId,
    });

    return data; // Return the data from the backend
  },
};

export const requestProductById = async (id: string) => {
	const { data: response } = await httpClient.get(
		`/shop/get?id=${id}`
	)
	return response
}

export const requestAllProductID = async () => {
	const { data: response } = await httpClient.get("/shop/getall");

	return response
}

export const requestProductsByStore = async ( storeId: string, page: number, pageSize: number, searchQuery?: string ,orderBy? :string ) => {
  const { data: response } = await httpClient.get(`/shop/get/storeProducts/${storeId}?page=${page}&pageSize=${pageSize}&searchQuery=${searchQuery}&orderBy=${orderBy}`);
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

export const requestUpdateProduct = async (Product: FormData): Promise<any> => {
	const { data: response } = await httpClient.patch("/shop/update" , Product)
	return response
}

export const requestUpdateProductImages = async (Product: FormData): Promise<any> => {
	const { data: response } = await httpClient.patch("/shop/update/images" , Product)
	return response
}

export const requestDeleteProduct = async (id: string): Promise<void> => {
  
	const { data: response } = await httpClient.delete("/shop/delete/" + id)
	return response
}

export const requestDeleteProductImage = async (id: string): Promise<void> => {
  
	const { data: response } = await httpClient.delete("/shop/delete/image/" + id)
	return response
}



