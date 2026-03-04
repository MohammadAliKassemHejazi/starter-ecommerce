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
  categoryId: string;
  userId?: string;
  isActive?: boolean;
  imgUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  category?: {
    id: string;
    name: string;
  };
}

export const defaultStoreViewModel: StoreViewModel = {
  id: '',
  name: 'Unknown Store',
  categoryId: '',
};

export interface ProductViewModel {
  id: string;
  name: string;
  description?: string;
  price?: number;
  originalPrice?: number;
  discount?: number;
  stockQuantity?: number;
  isActive?: boolean;
  subcategoryId?: string;
  categoryId?: string;
  storeId?: string;
  ownerId?: string;
  thumbnail?: string;
  metaTitle?: string;
  metaDescription?: string;
  ratings?: number;
  commentsCount?: number;
  createdAt?: string;
  updatedAt?: string;
  productImages?: Array<{
    id: string;
    url: string;
    alt?: string;
    imageUrl?: string;
  }>;
  store?: {
    id: string;
    name: string;
  };
  category?: {
    id: string;
    name: string;
  };
  subcategory?: {
    id: string;
    name: string;
  };
  sizeItems?: Array<{
    id: string;
    size: any;
    sizeId: string;
    quantity: number;
  }>;
}

export const defaultProductViewModel: ProductViewModel = {
  id: '',
  name: 'Unknown Product',
  description: '',
  price: 0,
  productImages: [],
};

export interface ArticleViewModel {
  id: string;
  title: string;
  content: string;
  authorId: string;
  storeId?: string;
  category?: string;
  published: boolean;
  publishedAt?: string;
  views: number;
  createdAt: string;
  updatedAt: string;
  images?: Array<{
    id: string;
    url: string;
  }>;
  author?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}

export const defaultArticleViewModel: ArticleViewModel = {
  id: '',
  title: '',
  content: '',
  authorId: '',
  published: false,
  views: 0,
  createdAt: '',
  updatedAt: '',
};

export interface OrderViewModel {
  id: string;
  userId: string;
  storeId: string;
  status: string;
  totalAmount: number;
  shippingAddress: string;
  paymentMethod: string;
  paymentStatus: string;
  items?: Array<{
    id: string;
    productId: string;
    quantity: number;
    price: number;
    productName: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export const defaultOrderViewModel: OrderViewModel = {
  id: '',
  userId: '',
  storeId: '',
  status: 'PENDING',
  totalAmount: 0,
  shippingAddress: '',
  paymentMethod: '',
  paymentStatus: 'PENDING',
  createdAt: '',
  updatedAt: '',
};

export interface PackageViewModel {
  id: string;
  name: string;
  description: string;
  price: number;
  durationInDays: number;
  features: string[];
  limits: {
    storeLimit: number;
    productLimit: number;
    userLimit: number;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const defaultPackageViewModel: PackageViewModel = {
  id: '',
  name: '',
  description: '',
  price: 0,
  durationInDays: 30,
  features: [],
  limits: {
    storeLimit: 1,
    productLimit: 10,
    userLimit: 1,
  },
  isActive: true,
  createdAt: '',
  updatedAt: '',
};
