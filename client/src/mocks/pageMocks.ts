import { IProductModel } from "../models/product.model";
import { IStoreResponseModel, IStoreModel } from "../models/store.model";
import { IArticleModel, IArticleModelWithUser } from "../models/article.model";
import { UserModel } from "../models/user.model";
import { CartItem } from "../models/cart.model";
import { IOrderModel, IOrder } from "../models/order.model";
import { IComment } from "../models/comment.model";
import { SignIn, SignUp } from "../models/auth.model";
import { ISize, ISizeItem } from "../models/size.model";
import { ICategories, ISubCategories } from "../models/utils.model";

export const authPageMocks = {
  signInSuccess: {
    data: {
      id: "user-1",
      email: "user@example.com",
      name: "John Doe",
      address: "123 Main St, Springfield, USA",
      phone: "+1234567890",
      bio: "Tech enthusiast.",
      accessToken: "mock-jwt-token-abc123xyz",
      roles: [{ id: "role-1", name: "Admin" }],
      permissions: [{ id: "perm-1", name: "manage_products" }]
    }
  } as SignIn,
  signUpRequest: {
    email: "newuser@example.com",
    password: "securepassword123",
    name: "Jane Doe",
    address: "456 Elm St, Gotham",
    phone: "+0987654321"
  } as SignUp
};

export const homePageMocks = {
  stores: [
    {
      id: "store-1",
      name: "Tech Haven",
      description: "Latest gadgets and electronics.",
      imgUrl: "https://example.com/tech-haven.jpg",
      categoryId: "cat-1",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "store-2",
      name: "Fashion Hub",
      description: "Trendy clothing and accessories.",
      imgUrl: "https://example.com/fashion-hub.jpg",
      categoryId: "cat-2",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ] as IStoreResponseModel[],
  articles: [
    {
      id: "article-1",
      title: "Top 10 Gadgets 2024",
      text: "A review of the best gadgets to buy this year...",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: "user-1"
    }
  ] as IArticleModel[],
  featuredProducts: [
    {
      id: "prod-1",
      name: "Wireless Headphones",
      description: "Noise-cancelling over-ear headphones.",
      price: 199.99,
      originalPrice: 249.99,
      discount: 20,
      stockQuantity: 50,
      isActive: true,
      thumbnail: "https://example.com/headphones.jpg"
    }
  ] as IProductModel[]
};

export const cartPageMocks = {
  cartItems: [
    {
      id: "prod-1",
      name: "Wireless Headphones",
      price: 199.99,
      originalPrice: 249.99,
      discount: 20,
      thumbnail: "https://example.com/headphones.jpg",
      cartQuantity: 2,
      size: "One Size"
    },
    {
      id: "prod-2",
      name: "Cotton T-Shirt",
      price: 19.99,
      originalPrice: 19.99,
      discount: 0,
      thumbnail: "https://example.com/tshirt.jpg",
      cartQuantity: 1,
      size: "M"
    }
  ] as CartItem[],
  subtotal: 419.97,
  shipping: 10.00,
  total: 429.97
};

export const profilePageMocks = {
  user: {
    id: "user-1",
    email: "user@example.com",
    name: "John Doe",
    address: "123 Main St, Springfield, USA",
    phone: "+1234567890",
    bio: "Tech enthusiast and casual blogger.",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  } as UserModel
};

export const shopPageMocks = {
  products: [
    {
      id: "prod-3",
      name: "Smartphone 14 Pro",
      description: "Latest smartphone with amazing camera.",
      price: 999.99,
      originalPrice: 1099.99,
      discount: 100,
      stockQuantity: 30,
      isActive: true,
      thumbnail: "https://example.com/smartphone.jpg",
      categoryId: "cat-1",
      storeId: "store-1"
    },
    {
      id: "prod-4",
      name: "Running Shoes",
      description: "Comfortable and lightweight.",
      price: 89.99,
      originalPrice: 120.00,
      discount: 30,
      stockQuantity: 100,
      isActive: true,
      thumbnail: "https://example.com/shoes.jpg",
      categoryId: "cat-2",
      storeId: "store-2"
    }
  ] as IProductModel[],
  filters: {
    categories: [
      { id: "cat-1", name: "Electronics" },
      { id: "cat-2", name: "Fashion" }
    ],
    priceRange: [0, 2000]
  }
};

export const productDetailsPageMocks = {
  product: {
    id: "prod-1",
    name: "Wireless Headphones",
    description: "High-quality noise-cancelling headphones.",
    price: 199.99,
    originalPrice: 249.99,
    discount: 20,
    stockQuantity: 50,
    isActive: true,
    thumbnail: "https://example.com/headphones.jpg",
    storeId: "store-1",
    ratings: 4.5,
    commentsCount: 12,
    sizeItems: [
      { id: "size-item-1", sizeId: "sz-1", size: { size: "Standard" }, quantity: 50 }
    ] as ISizeItem[],
    comments: [
      {
        id: "com-1",
        userName: "Alice",
        comment: "Great sound quality!"
      },
      {
        id: "com-2",
        userName: "Bob",
        comment: "Comfortable for long hours."
      }
    ] as IComment[]
  } as IProductModel,
  availableSizes: [
    { id: "sz-1", size: "Standard" },
    { id: "sz-2", size: "Large" }
  ] as ISize[]
};

export const dashboardPageMocks = {
  stats: {
    totalSales: 15400.50,
    activeOrders: 42,
    newCustomers: 15,
    totalProducts: 120
  },
  recentOrders: [
    {
      id: "ord-1",
      paymentId: "pay-123",
      customerName: "Alice Smith",
      totalPrice: 219.98,
      status: "Completed",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "ord-2",
      paymentId: "pay-124",
      customerName: "Bob Johnson",
      totalPrice: 89.99,
      status: "Pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ] as IOrderModel[]
};

export const ordersPageMocks = {
  orders: [
    {
      id: "ord-1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      orderItems: [
        { id: "oi-1", productId: "prod-1", quantity: 1, price: 199.99 },
        { id: "oi-2", productId: "prod-2", quantity: 1, price: 19.99 }
      ]
    },
    {
      id: "ord-3",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      orderItems: [
        { id: "oi-3", productId: "prod-3", quantity: 1, price: 999.99 }
      ]
    }
  ] as IOrder[]
};

export const articlesPageMocks = {
  articles: [
    {
      id: "article-1",
      title: "Top 10 Gadgets 2024",
      text: "A review of the best gadgets to buy this year...",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user: {
        id: "user-1",
        name: "John Doe"
      }
    },
    {
      id: "article-2",
      title: "Spring Fashion Trends",
      text: "What to wear this spring season...",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user: {
        id: "user-2",
        name: "Jane Smith"
      }
    }
  ] as IArticleModelWithUser[]
};

export const storePageMocks = {
  storeDetails: {
    id: "store-1",
    name: "Tech Haven",
    description: "Latest gadgets and electronics.",
    imgUrl: "https://example.com/tech-haven.jpg",
    categoryId: "cat-1",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  } as IStoreResponseModel,
  storeFormInitialValues: {
    name: "Tech Haven",
    description: "Latest gadgets and electronics.",
    categoryId: "cat-1",
    croppedImages: []
  } as IStoreModel,
  storeProducts: [
    {
      id: "prod-1",
      name: "Wireless Headphones",
      description: "Noise-cancelling over-ear headphones.",
      price: 199.99,
      originalPrice: 249.99,
      discount: 20,
      stockQuantity: 50,
      isActive: true,
      thumbnail: "https://example.com/headphones.jpg",
      storeId: "store-1"
    },
    {
      id: "prod-3",
      name: "Smartphone 14 Pro",
      description: "Latest smartphone with amazing camera.",
      price: 999.99,
      originalPrice: 1099.99,
      discount: 100,
      stockQuantity: 30,
      isActive: true,
      thumbnail: "https://example.com/smartphone.jpg",
      storeId: "store-1"
    }
  ] as IProductModel[]
};

export const categoriesPageMocks = {
  categories: [
    {
      id: "cat-1",
      name: "Electronics",
      description: "Devices, gadgets, and accessories.",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "cat-2",
      name: "Fashion",
      description: "Clothing, shoes, and jewelry.",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ] as ICategories[],
  subCategories: [
    {
      id: "sub-1",
      name: "Smartphones",
      description: "Mobile phones.",
      categoryId: "cat-1",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "sub-2",
      name: "Men's Clothing",
      description: "Apparel for men.",
      categoryId: "cat-2",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ] as ISubCategories[]
};
