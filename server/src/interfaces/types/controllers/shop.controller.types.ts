import { CustomRequest } from "../middlewares/request.middleware.types";
import { ISizeItemAttributes } from "../models/sizeitem.model.types";

// Define the interface for handling create product requests
export interface IShopCreateProduct extends CustomRequest {
     sizes?: [ISizeItemAttributes];
    body: {
        productData: {
    name?: string;
    description?: string;
    price?: number;
    stockQuantity?: number; // Can be number or undefined
    isActive?: boolean; // Can be boolean or undefined
    ownerId?:string,
    categoryId?: string,
    sizes?: [ISizeItemAttributes];
        };
    };
}
// used in get product by storeid
export interface FetchProductsByStoreParams {
    storeId: string;
    ownerId: string;
  page: number;
    pageSize: number;
    searchQuery?: string;
}
