import { IProduct } from '@shared/types/product.types';

export interface ProductsState {
  product?: IProduct;
  products: IProduct[];
  Storeproducts?: IProduct[];
  total: number;
  page: number;
  pageSize: number;
  error?: string;
  loading: boolean;
}
