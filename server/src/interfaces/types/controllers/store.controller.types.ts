import { CustomRequest } from "../middlewares/request.middleware.types";

export interface IStoreCreateProduct extends CustomRequest {
    name?: string;
    description?: string;
    userId?: string;
    categoryId?: string;
    imgUrl?: string;
}
