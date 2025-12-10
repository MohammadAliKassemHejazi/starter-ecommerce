
import httpClient from "@/utils/httpClient"
import { ImageListType } from "react-images-uploading";
import { 
	ProductResponse, 
	ProductsListResponse, 
	CreateProductResponse, 
	UpdateProductResponse, 
	DeleteProductResponse 
} from "@/interfaces/api/product.types";
import { CreatePaymentResponse } from "@/interfaces/api/payment.types";

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
  createPayment: async ({ amount, currency, paymentMethodId }: { amount: number; currency: string; paymentMethodId: string }): Promise<CreatePaymentResponse> => {
    console.log({ amount, currency, paymentMethodId }, "charge");

    const { data } = await httpClient.post<CreatePaymentResponse>('/payment/charge', {
      amount,
      currency,
      paymentMethodId,
    });

    return data; // Return the data from the backend
  },
};

export const requestProductById = async (id: string): Promise<ProductResponse> => {
	const { data: response } = await httpClient.get<ProductResponse>(
		`/shop/get?id=${id}`
	)
	return response;
}

export const requestAllProductID = async (): Promise<ProductsListResponse> => {
	const { data: response } = await httpClient.get<ProductsListResponse>("/shop/getall");
	return response
}

export const requestProductsByStore = async ( storeId: string, page: number, pageSize: number, searchQuery?: string ,orderBy? :string ): Promise<ProductsListResponse> => {
  const { data: response } = await httpClient.get<ProductsListResponse>(`/shop/get/storeProducts/${storeId}?page=${page}&pageSize=${pageSize}&searchQuery=${searchQuery}&orderBy=${orderBy}`);
  return response;
};

export const requestProductsListing = async ( page: number, pageSize: number ): Promise<ProductsListResponse> => {
  const { data: response } = await httpClient.get<ProductsListResponse>(`/shop/get/productListing/?page=${page}&pageSize=${pageSize}`);
  return response;
};

export const requestCreateProducts = async (Product: FormData): Promise<CreateProductResponse> => {
	const { data: response } = await httpClient.post<CreateProductResponse>("/shop/create", Product)
	return response
}

export const requestUpdateProduct = async (Product: FormData): Promise<UpdateProductResponse> => {
	const { data: response } = await httpClient.patch<UpdateProductResponse>("/shop/update" , Product)
	return response
}

export const requestUpdateProductImages = async (Product: FormData): Promise<UpdateProductResponse> => {
	const { data: response } = await httpClient.patch<UpdateProductResponse>("/shop/update/images" , Product)
	return response
}

export const requestDeleteProduct = async (id: string): Promise<DeleteProductResponse> => {
	const { data: response } = await httpClient.delete<DeleteProductResponse>("/shop/delete/" + id)
	return response
}

export const requestDeleteProductImage = async (id: string): Promise<DeleteProductResponse> => {
	const { data: response } = await httpClient.delete<DeleteProductResponse>("/shop/delete/image/" + id)
	return response
}



