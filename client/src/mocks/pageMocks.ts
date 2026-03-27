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

// ==========================================
// EXHAUSTIVE MOCK DATA FOR EVERY PAGE
// ==========================================

export const pages_app_tsx_mocks = {
  globalConfig: { theme: "light", lang: "en" }
};

export const pages_document_tsx_mocks = {
  documentMeta: { charset: "utf-8", title: "App" }
};

export const pages_index_tsx_mocks = {
  isRedirecting: true
};

export const pages_home_tsx_mocks = {
  stores: [{ id: "store-1", name: "Tech Haven", description: "Latest gadgets.", imgUrl: "https://example.com/tech.jpg", categoryId: "cat-1", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }] as IStoreResponseModel[],
  articles: [{ id: "article-1", title: "Top 10 Gadgets", content: "Review...", published: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), authorId: "user-1" }] as IArticleModel[],
  featuredProducts: [{ id: "prod-1", name: "Wireless Headphones", price: 199.99, originalPrice: 249.99, discount: 20, stockQuantity: 50, thumbnail: "https://example.com/headphones.jpg" }] as IProductModel[]
};

export const pages_about_tsx_mocks = {
  companyInfo: { name: "E-Commerce Inc.", mission: "Best shopping experience.", founded: "2010" }
};

export const pages_plans_tsx_mocks = {
  plansList: [{ id: "plan-1", name: "Basic", price: 0, features: ["Up to 1 Store"] }, { id: "plan-2", name: "Pro", price: 29.99, features: ["Up to 5 Stores"] }]
};

export const pages_profile_tsx_mocks = {
  userProfile: { id: "user-1", email: "user@example.com", name: "John Doe", address: "123 Main St", phone: "+1234567890", createdAt: new Date().toISOString() } as UserModel
};

export const pages_settings_tsx_mocks = {
  userSettings: { notifications: true, darkMode: false, language: "en" }
};

export const pages_analytics_index_tsx_mocks = {
  salesData: [{ date: "2024-01-01", sales: 1200 }],
  visitorStats: { daily: 500, weekly: 3500, monthly: 15000 }
};

export const pages_api_user_AUTH_ts_mocks = {
  // Mocking the data expected to be handled by the next-auth/custom auth API
  mockSessionPayload: { user: { id: "user-1", email: "user@example.com", name: "John Doe" }, expires: "2024-12-31T23:59:59.000Z" }
};

export const pages_articles_pid_tsx_mocks = {
  articleDetails: { id: "article-1", title: "Top 10 Gadgets", content: "Full review...", published: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), authorId: "user-1" } as IArticleModel
};

export const pages_articles_create_tsx_mocks = {
  articleCreateForm: { title: "", text: "", userId: "user-1" }
};

export const pages_articles_edit_tsx_mocks = {
  articleEditFormInitialData: { id: "article-1", title: "Top 10 Gadgets Updated", text: "Full review updated...", userId: "user-1" }
};

export const pages_articles_index_tsx_mocks = {
  articlesDashboard: { totalArticles: 10, recentDrafts: 2 }
};

export const pages_articles_list_tsx_mocks = {
  articlesList: [{ id: "article-1", title: "Top 10 Gadgets", content: "Review...", published: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), author: { id: "user-1", name: "John Doe", email: "user@example.com" } }] as IArticleModelWithUser[]
};

export const pages_auth_reset_password_token_tsx_mocks = {
  resetPasswordForm: { token: "url-token-123", newPassword: "", confirmPassword: "" }
};

export const pages_auth_forgot_password_tsx_mocks = {
  forgotPasswordForm: { email: "" }
};

export const pages_auth_signin_tsx_mocks = {
  signInSuccessResponse: { data: { id: "user-1", email: "user@example.com", name: "John Doe", address: "123 Main St", phone: "+1", accessToken: "jwt-abc", roles: [{ id: "role-1", name: "Admin" }], permissions: [] } } as SignIn
};

export const pages_auth_signup_tsx_mocks = {
  signUpRequestForm: { data: { id: "", email: "", name: "", address: "", phone: "" } } as SignUp
};

export const pages_cart_index_tsx_mocks = {
  cartItems: [{ id: "prod-1", name: "Wireless Headphones", price: 199.99, originalPrice: 249.99, discount: 20, quantity: 2, size: "One Size" }] as CartItem[],
  summary: { subtotal: 399.98, shipping: 10.00, total: 409.98 }
};

export const pages_categories_create_tsx_mocks = {
  categoryCreateForm: { name: "", description: "" } as ICategories
};

export const pages_categories_edit_tsx_mocks = {
  categoryEditFormInitialData: { id: "cat-1", name: "Electronics (Updated)", description: "Gadgets." } as ICategories
};

export const pages_categories_index_tsx_mocks = {
  categoriesList: [{ id: "cat-1", name: "Electronics", description: "Gadgets.", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }] as ICategories[]
};

export const pages_comments_index_tsx_mocks = {
  commentsList: [{ id: "com-1", productId: "prod-1", userName: "Alice", comment: "Great sound quality!", date: new Date().toISOString() }]
};

export const pages_dashboard_index_tsx_mocks = {
  stats: { totalSales: 15400.50, activeOrders: 42, newCustomers: 15, totalProducts: 120 },
  recentOrders: [{ id: "ord-1", userId: "user-1", storeId: "store-1", status: "Completed", totalAmount: 219.98, shippingAddress: "123 Main St", paymentMethod: "Credit Card", paymentStatus: "Paid", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), items: [] }] as IOrderModel[]
};

export const pages_favorites_index_tsx_mocks = {
  favoriteProducts: [{ id: "prod-1", name: "Wireless Headphones", price: 199.99, originalPrice: 249.99, stockQuantity: 50, storeId: "store-1" }] as IProductModel[]
};

export const pages_orders_user_index_tsx_mocks = {
  userOrdersList: [{ id: "ord-1", userId: "user-1", storeId: "store-1", status: "Completed", totalAmount: 199.99, shippingAddress: "123 Main St", paymentMethod: "Credit Card", paymentStatus: "Paid", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }] as IOrder[]
};

export const pages_orders_index_tsx_mocks = {
  allOrdersList: [{ id: "ord-1", userId: "user-1", storeId: "store-1", status: "Completed", totalAmount: 199.99, shippingAddress: "123 Main St", paymentMethod: "Credit Card", paymentStatus: "Paid", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }] as IOrder[]
};

export const pages_packages_index_tsx_mocks = {
  subscriptionPackagesList: [{ id: "plan-1", name: "Basic", price: 0, features: ["Up to 1 Store"] }, { id: "plan-2", name: "Pro", price: 29.99, features: ["Up to 5 Stores"] }]
};

export const pages_payment_checkoutwithstripe_tsx_mocks = {
  checkoutDetails: { clientSecret: "pi_123456789_secret_0987654321", amount: 409.98, currency: "usd" }
};

export const pages_permissions_create_tsx_mocks = {
  permissionCreateForm: { name: "", description: "" }
};

export const pages_permissions_edit_tsx_mocks = {
  permissionEditFormInitialData: { id: "perm-1", name: "manage_users_v2", description: "Updated desc." }
};

export const pages_permissions_index_tsx_mocks = {
  permissionsList: [{ id: "perm-1", name: "manage_users", description: "Can manage users." }]
};

export const pages_promotions_create_tsx_mocks = {
  promotionCreateForm: { code: "", discountPercentage: 0, expiresAt: "" }
};

export const pages_promotions_edit_tsx_mocks = {
  promotionEditFormInitialData: { id: "promo-1", code: "SUMMER25", discountPercentage: 25, expiresAt: "2024-09-15T23:59:59Z" }
};

export const pages_promotions_index_tsx_mocks = {
  promotionsList: [{ id: "promo-1", code: "SUMMER20", discountPercentage: 20, expiresAt: "2024-08-31T23:59:59Z" }]
};

export const pages_returns_index_tsx_mocks = {
  returnRequestsList: [{ id: "ret-1", orderId: "ord-1", productId: "prod-1", reason: "Defective", status: "Pending", createdAt: new Date().toISOString() }]
};

export const pages_roles_Assignment_index_tsx_mocks = {
  roleAssignmentList: [{ userId: "user-1", userName: "John", roleId: "role-1", roleName: "Admin" }]
};

export const pages_roles_Assignment_users_tsx_mocks = {
  assignRoleForm: { userId: "user-2", roleId: "role-1" }
};

export const pages_roles_create_tsx_mocks = {
  roleCreateForm: { name: "", permissions: [] }
};

export const pages_roles_edit_tsx_mocks = {
  roleEditFormInitialData: { id: "role-1", name: "Super Admin", permissions: ["manage_users", "manage_all"] }
};

export const pages_roles_index_tsx_mocks = {
  rolesList: [{ id: "role-1", name: "Admin", permissions: ["manage_users"] }]
};

export const pages_shipping_index_tsx_mocks = {
  shippingMethodsList: [{ id: "ship-1", name: "Standard", cost: 5.99, estimatedDays: "3-5" }]
};

export const pages_shop_product_pid_tsx_mocks = {
  productDetails: { id: "prod-1", name: "Wireless Headphones", price: 199.99, originalPrice: 249.99, stockQuantity: 50, storeId: "store-1", ratings: 4.5, commentsCount: 1, sizeItems: [{ id: "size-item-1", sizeId: "sz-1", size: { size: "Standard" }, quantity: 50 }], comments: [{ id: "com-1", userName: "Alice", comment: "Great!" }] } as IProductModel,
  availableSizes: [{ id: "sz-1", size: "Standard" }] as ISize[]
};

export const pages_shop_product_create_tsx_mocks = {
  productCreateForm: { name: "", description: "", price: 0, originalPrice: 0, stockQuantity: 1, categoryId: "", storeId: "", photos: [] } as IProductModel
};

export const pages_shop_product_edit_tsx_mocks = {
  productEditFormInitialData: { id: "prod-1", name: "Wireless Headphones 2.0", description: "Updated headphones.", price: 189.99, originalPrice: 249.99, stockQuantity: 45, categoryId: "cat-1", storeId: "store-1" } as IProductModel
};

export const pages_shop_index_tsx_mocks = {
  featuredCategories: [{ id: "cat-1", name: "Electronics" }, { id: "cat-2", name: "Fashion" }]
};

export const pages_shop_list_tsx_mocks = {
  productList: [{ id: "prod-3", name: "Smartphone 14 Pro", price: 999.99, originalPrice: 1099.99, discount: 100, stockQuantity: 30, categoryId: "cat-1", storeId: "store-1" }, { id: "prod-4", name: "Running Shoes", price: 89.99, originalPrice: 120.00, discount: 30, stockQuantity: 100, categoryId: "cat-2", storeId: "store-2" }] as IProductModel[],
  filters: { categories: [{ id: "cat-1", name: "Electronics" }], priceRange: [0, 2000] }
};

export const pages_sizes_index_tsx_mocks = {
  sizesList: [{ id: "sz-1", size: "Small" }, { id: "sz-2", size: "Medium" }] as ISize[]
};

export const pages_store_id_tsx_mocks = {
  storeDetails: { id: "store-1", name: "Tech Haven", description: "Latest gadgets.", imgUrl: "https://example.com/tech.jpg", categoryId: "cat-1", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as IStoreResponseModel,
  storeProducts: [{ id: "prod-3", name: "Smartphone 14 Pro", price: 999.99, originalPrice: 1099.99, discount: 100, stockQuantity: 30, categoryId: "cat-1", storeId: "store-1" }] as IProductModel[]
};

export const pages_store_create_tsx_mocks = {
  storeCreateForm: { name: "", description: "", categoryId: "", croppedImages: [] } as IStoreModel
};

export const pages_store_edit_tsx_mocks = {
  storeEditFormInitialData: { id: "store-1", name: "Tech Haven Global", description: "Updated store desc.", categoryId: "cat-1", croppedImages: [] } as IStoreModel
};

export const pages_store_index_tsx_mocks = {
  storesList: [{ id: "store-1", name: "Tech Haven", description: "Latest gadgets.", imgUrl: "https://example.com/tech.jpg", categoryId: "cat-1", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }] as IStoreResponseModel[]
};

export const pages_subcategories_create_tsx_mocks = {
  subcategoryCreateForm: { name: "", description: "", categoryId: "" } as ISubCategories
};

export const pages_subcategories_edit_tsx_mocks = {
  subcategoryEditFormInitialData: { id: "sub-1", name: "Smartphones 5G", description: "Phones.", categoryId: "cat-1" } as ISubCategories
};

export const pages_subcategories_index_tsx_mocks = {
  subCategoriesList: [{ id: "sub-1", name: "Smartphones", description: "Phones.", categoryId: "cat-1", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }] as ISubCategories[]
};

export const pages_taxes_index_tsx_mocks = {
  taxRatesList: [{ id: "tax-1", region: "California", rate: 7.25 }]
};

export const pages_users_create_tsx_mocks = {
  userCreateForm: { email: "", name: "", password: "" }
};

export const pages_users_edit_tsx_mocks = {
  userEditFormInitialData: { id: "user-1", email: "user@example.com", name: "John Doe", address: "123 Main St", phone: "+1234567890", createdAt: new Date().toISOString() } as UserModel
};

export const pages_users_index_tsx_mocks = {
  usersList: [{ id: "user-1", email: "user@example.com", name: "John Doe", address: "123 Main St", phone: "+1234567890", createdAt: new Date().toISOString() }] as UserModel[]
};

export const pages_navigation_demo_tsx_mocks = {
  navItems: [{ label: "Home", href: "/" }]
};

export const pages_permission_demo_tsx_mocks = {
  demoPermissions: ["read_users", "write_products"]
};

export const pages_scss_test_tsx_mocks = {
  scssConfig: { primaryColor: "#000" }
};

export const pages_style_test_tsx_mocks = {
  styleConfig: { theme: "dark" }
};

export const pages_table_demo_tsx_mocks = {
  tableData: [{ id: 1, name: "Item A" }]
};

export const pages_test_permissions_tsx_mocks = {
  testResult: { success: true, allowed: true }
};
