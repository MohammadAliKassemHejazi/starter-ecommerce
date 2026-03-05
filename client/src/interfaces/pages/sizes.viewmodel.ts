// Auto-generated View Model for Sizes Page
export interface Size {
  id: string;
  size: string;
  createdAt: string;
  updatedAt: string;
}

export interface SizeItem {
  id: string;
  productId: string;
  sizeId: string;
  quantity: number;
  product?: {
    id: string;
    name: string;
  };
  Size?: {
    id: string;
    size: string;
  };
  createdAt: string;
}

export interface ISizesPageViewModel {
    // Add properties for Sizes view model
}
