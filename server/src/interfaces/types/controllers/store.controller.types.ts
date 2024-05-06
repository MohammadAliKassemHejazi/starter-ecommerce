import { CustomRequest } from "../middlewares/request.middleware.types";


export interface IStoreCreateProduct extends CustomRequest {

    body: {
        storeData: {
    name?: string;
    description?: string;
    ownerId?:string
        };
    };
}
