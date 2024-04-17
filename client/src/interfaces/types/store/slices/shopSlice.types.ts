import { IProductModel } from "@/models/product.model";

export interface ProductsState {
    product?: IProductModel;
	products?: IProductModel[];
	error?: string;
}