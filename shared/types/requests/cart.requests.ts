// Cart Request Body Types

export interface AddToCartRequest {
  productId: string;
  quantity: number;
  sizeId?: string;
}

export interface DecreaseCartRequest {
  productId: string;
  quantity: number;
  sizeId?: string;
}
