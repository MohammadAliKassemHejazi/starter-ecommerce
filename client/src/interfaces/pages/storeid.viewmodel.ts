import { ParsedUrlQuery } from 'querystring';
import { IProductModel } from "@/models/product.model";

// Auto-generated View Model for StoreId Page
export interface IParams extends ParsedUrlQuery {
  id: string;
}

export interface SingleStoreProps {
  initialStore?: {
    id: string;
    name: string;
    description?: string;
    imgUrl: string;
    categoryId: string;
    metaTitle?: string;
    metaDescription?: string;
  };
  initialProducts?: Array<{
    page: number;
    pageSize: number;
    total: number;
    products: IProductModel[];

  }>;
}

export interface IStoreIdPageViewModel {
    // Add properties for StoreId view model
}
