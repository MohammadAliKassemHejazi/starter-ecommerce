import { CustomRequest } from "../middlewares/request.middleware.types";

// Define the interface for handling create product requests
export interface IShopCreateProduct extends CustomRequest {

    body: {
        productData: {
    name?: string;
    description?: string;
    price?: number;
    stockQuantity?: number; // Can be number or undefined
    isActive?: boolean; // Can be boolean or undefined
    ownerId?:string,
    categoryId?:string,
        };
    };
}
// used in get product by storeid
export interface FetchProductsByStoreParams {
    storeId: string;
    userId: string;
  page: number;
  pageSize: number;
}
