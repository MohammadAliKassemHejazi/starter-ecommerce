// Product Request Body Types

export interface ISizeItemRequest {
  sizeId: string;
  quantity: number;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  stockQuantity: number;
  isActive?: boolean;
  subcategoryId: string;
  categoryId: string;
  storeId: string;
  metaTitle?: string;
  metaDescription?: string;
  sizes?: ISizeItemRequest[];
  // thumbnail / images sent as FormData
}

export interface UpdateProductRequest {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  originalPrice?: number;
  discount?: number;
  stockQuantity?: number;
  isActive?: boolean;
  subcategoryId?: string;
  categoryId?: string;
  metaTitle?: string;
  metaDescription?: string;
  sizes?: ISizeItemRequest[];
}

export interface UpdateProductImagesRequest {
  productId: string;
  // image files sent as FormData
}

export interface GetProductsByStoreRequest {
  storeId: string;
  page: number;
  pageSize: number;
  searchQuery?: string;
  orderBy?: string;
}
