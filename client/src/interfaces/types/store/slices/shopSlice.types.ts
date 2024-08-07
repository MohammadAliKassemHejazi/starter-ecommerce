import { IProductModel } from "@/models/product.model";

export interface ProductsState {
  product?: IProductModel;
  products?: IProductModel[];
  Storeproducts?: IProductModel[];
  total: number;
  page: number;
  pageSize: number;
  error?: string;
}
