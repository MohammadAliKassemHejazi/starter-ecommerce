// Store Request Body Types

export interface CreateStoreRequest {
  name: string;
  description?: string;
  categoryId: string;
  metaTitle?: string;
  metaDescription?: string;
  // image sent as FormData (imgUrl resolved server-side)
}

export interface UpdateStoreRequest {
  storeId: string;
  name?: string;
  description?: string;
  categoryId?: string;
  isActive?: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

export interface UpdateStoreImageRequest {
  storeId: string;
  // image file sent as FormData
}
