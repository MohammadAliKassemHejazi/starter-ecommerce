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

// --- AUTHENTICATION ---
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

// --- HOME & STATIC PAGES ---
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

export const aboutPageMocks = {
  companyInfo: {
    name: "E-Commerce Inc.",
    mission: "To provide the best shopping experience.",
    founded: "2010",
    teamSize: 150
  }
};

export const plansPageMocks = {
  plans: [
    {
      id: "plan-1",
      name: "Basic",
      price: 0,
      features: ["Up to 1 Store", "Up to 50 Products", "Community Support"]
    },
    {
      id: "plan-2",
      name: "Pro",
      price: 29.99,
      features: ["Up to 5 Stores", "Unlimited Products", "Priority Support"]
    }
  ]
};

// --- E-COMMERCE CORE (Shop, Cart, Products, Categories) ---
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

export const subcategoriesPageMocks = {
  subCategories: categoriesPageMocks.subCategories
};

export const sizesPageMocks = {
  sizes: [
    { id: "sz-1", size: "Small" },
    { id: "sz-2", size: "Medium" },
    { id: "sz-3", size: "Large" }
  ] as ISize[]
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

export const favoritesPageMocks = {
  favoriteProducts: [
    productDetailsPageMocks.product
  ] as IProductModel[]
};

// --- USER & ACCOUNT ---
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

export const usersPageMocks = {
  usersList: [
    profilePageMocks.user,
    {
      id: "user-2",
      email: "jane@example.com",
      name: "Jane Smith",
      address: "456 Elm St, Gotham",
      phone: "+0987654321",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ] as UserModel[]
};

export const settingsPageMocks = {
  userSettings: {
    notifications: true,
    darkMode: false,
    language: "en"
  }
};

// --- ORDERS & TRANSACTIONS ---
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

export const paymentPageMocks = {
  paymentHistory: [
    { id: "pay-1", orderId: "ord-1", amount: 429.97, status: "Successful", date: new Date().toISOString() }
  ],
  checkoutDetails: {
    clientSecret: "pi_123456789_secret_0987654321"
  }
};

export const returnsPageMocks = {
  returnRequests: [
    {
      id: "ret-1",
      orderId: "ord-1",
      productId: "prod-1",
      reason: "Defective item",
      status: "Pending",
      createdAt: new Date().toISOString()
    }
  ]
};

// --- ADMIN & MANAGEMENT ---
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

export const analyticsPageMocks = {
  salesData: [
    { date: "2024-01-01", sales: 1200 },
    { date: "2024-02-01", sales: 1500 },
    { date: "2024-03-01", sales: 1800 }
  ],
  visitorStats: {
    daily: 500,
    weekly: 3500,
    monthly: 15000
  }
};

export const commentsPageMocks = {
  allComments: [
    { id: "com-1", productId: "prod-1", userName: "Alice", comment: "Great sound quality!", date: new Date().toISOString() },
    { id: "com-2", articleId: "article-1", userName: "Bob", comment: "Very informative article.", date: new Date().toISOString() }
  ]
};

export const packagesPageMocks = {
  subscriptionPackages: plansPageMocks.plans
};

export const permissionsPageMocks = {
  permissionsList: [
    { id: "perm-1", name: "manage_users", description: "Can create, edit, and delete users." },
    { id: "perm-2", name: "manage_products", description: "Can create, edit, and delete products." },
    { id: "perm-3", name: "view_analytics", description: "Can view sales and visitor analytics." }
  ]
};

export const promotionsPageMocks = {
  promotionsList: [
    { id: "promo-1", code: "SUMMER20", discountPercentage: 20, isActive: true, expiresAt: "2024-08-31T23:59:59Z" },
    { id: "promo-2", code: "WELCOME10", discountPercentage: 10, isActive: true, expiresAt: "2024-12-31T23:59:59Z" }
  ]
};

export const rolesPageMocks = {
  rolesList: [
    { id: "role-1", name: "Admin", permissions: ["manage_users", "manage_products", "view_analytics"] },
    { id: "role-2", name: "Store Manager", permissions: ["manage_products", "view_analytics"] },
    { id: "role-3", name: "Customer", permissions: [] }
  ]
};

export const shippingPageMocks = {
  shippingMethods: [
    { id: "ship-1", name: "Standard Shipping", cost: 5.99, estimatedDays: "3-5" },
    { id: "ship-2", name: "Express Shipping", cost: 14.99, estimatedDays: "1-2" }
  ],
  shippingZones: [
    { id: "zone-1", name: "Domestic", countries: ["US", "CA"] },
    { id: "zone-2", name: "International", countries: ["UK", "DE", "FR"] }
  ]
};

export const taxesPageMocks = {
  taxRates: [
    { id: "tax-1", region: "California", rate: 7.25 },
    { id: "tax-2", region: "New York", rate: 4.00 }
  ]
};

// --- CONTENT & MEDIA ---
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
