// Shared interfaces for View Models across the application

export interface UserViewModel {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  bio?: string;
  roles?: Array<{ id: string; name: string }>;
  permissions?: Array<{ id: string; name: string }>;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const defaultUserViewModel: UserViewModel = {
  id: '',
  name: 'Unknown User',
  email: 'no-email@example.com',
  phone: '',
  address: '',
  bio: '',
  roles: [],
  permissions: [],
  avatarUrl: '',
};

export interface CategoryViewModel {
  id: string;
  name: string;
  description?: string;
  image?: string;
  userId?: string;
  subcategories?: SubCategoryViewModel[];
  createdAt?: string;
  updatedAt?: string;
}

export const defaultCategoryViewModel: CategoryViewModel = {
  id: '',
  name: 'Unknown Category',
  description: '',
  image: '',
  subcategories: [],
};

export interface SubCategoryViewModel {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  image?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const defaultSubCategoryViewModel: SubCategoryViewModel = {
  id: '',
  categoryId: '',
  name: 'Unknown Subcategory',
  description: '',
  image: '',
};

export interface StoreViewModel {
  id: string;
  name: string;
  description?: string;
  userId?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  imgUrl?: string;
  croppedImages?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export const defaultStoreViewModel: StoreViewModel = {
  id: '',
  name: 'Unknown Store',
  description: '',
  address: '',
  phone: '',
  email: '',
  website: '',
  imgUrl: '',
  croppedImages: [],
};

export interface ProductViewModel {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId?: string;
  subCategoryId?: string;
  storeId?: string;
  productImages?: Array<{ id: string; url: string; altText?: string }>;
  createdAt?: string;
  updatedAt?: string;
}

export const defaultProductViewModel: ProductViewModel = {
  id: '',
  name: 'Unknown Product',
  description: '',
  price: 0,
  stock: 0,
  productImages: [],
};
