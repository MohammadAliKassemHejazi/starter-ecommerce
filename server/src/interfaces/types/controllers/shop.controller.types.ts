import { CustomRequest } from "../middlewares/request.middleware.types";
import { Express } from "express";

// Define the interface for handling create product requests
export interface IShopCreateProduct extends CustomRequest {

    body: {
        productData: {
            name?: string;
            description?: string;
            price?: number;
        };
    };
}
