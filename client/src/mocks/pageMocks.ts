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
// MOCKS MAPPED EXACTLY TO client/pages/ *.tsx
// ==========================================

// --- CORE / GLOBAL ---
export const appPageMocks = {
  // `pages/_app.tsx` & `pages/_document.tsx` don't usually fetch specific page data, but we can provide global config mocks
  globalConfig: { theme: "light", lang: "en" }
};

export const indexPageMocks = {
  // `pages/index.tsx` (Root redirect or landing)
  isRedirecting: true
};

export const homePageMocks = {
  // `pages/home.tsx`
  stores: [{ id: "store-1", name: "Tech Haven", description: "Latest gadgets.", imgUrl: "https://example.com/tech.jpg", categoryId: "cat-1", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }] as IStoreResponseModel[],
  articles: [{ id: "article-1", title: "Top 10 Gadgets", text: "Review...", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), userId: "user-1" }] as IArticleModel[],
  featuredProducts: [{ id: "prod-1", name: "Wireless Headphones", price: 199.99, originalPrice: 249.99, discount: 20, stockQuantity: 50, isActive: true, thumbnail: "https://example.com/headphones.jpg" }] as IProductModel[]
};

export const aboutPageMocks = {
  // `pages/about.tsx`
  companyInfo: { name: "E-Commerce Inc.", mission: "Best shopping experience.", founded: "2010" }
};

export const plansPageMocks = {
  // `pages/plans.tsx`
  plansList: [
    { id: "plan-1", name: "Basic", price: 0, features: ["Up to 1 Store"] },
    { id: "plan-2", name: "Pro", price: 29.99, features: ["Up to 5 Stores"] }
  ]
};

export const settingsPageMocks = {
  // `pages/settings.tsx`
  userSettings: { notifications: true, darkMode: false, language: "en" }
};

export const profilePageMocks = {
  // `pages/profile.tsx`
  userProfile: { id: "user-1", email: "user@example.com", name: "John Doe", address: "123 Main St", phone: "+1234567890", isActive: true, createdAt: new Date().toISOString() } as UserModel
};

export const dashboardIndexPageMocks = {
  // `pages/dashboard/index.tsx`
  stats: { totalSales: 15400.50, activeOrders: 42, newCustomers: 15, totalProducts: 120 },
  recentOrders: [{ id: "ord-1", paymentId: "pay-123", customerName: "Alice Smith", totalPrice: 219.98, status: "Completed", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }] as IOrderModel[]
};

// --- AUTHENTICATION ---
export const authSignupPageMocks = {
  // `pages/auth/signup.tsx`
  signUpRequestForm: { email: "", password: "", name: "", address: "", phone: "" } as SignUp
};

export const authSigninPageMocks = {
  // `pages/auth/signin.tsx`
  signInSuccessResponse: { data: { id: "user-1", email: "user@example.com", name: "John Doe", address: "123 Main St", phone: "+1", accessToken: "jwt-abc", roles: [{ id: "role-1", name: "Admin" }], permissions: [] } } as SignIn
};

export const authForgotPasswordPageMocks = {
  // `pages/auth/forgot_password.tsx`
  forgotPasswordForm: { email: "" }
};

export const authResetPasswordTokenPageMocks = {
  // `pages/auth/reset_password/[token].tsx`
  resetPasswordForm: { token: "url-token-123", newPassword: "", confirmPassword: "" }
};


// --- SHOP & PRODUCTS ---
export const shopIndexPageMocks = {
  // `pages/shop/index.tsx`
  featuredCategories: [{ id: "cat-1", name: "Electronics" }, { id: "cat-2", name: "Fashion" }]
};

export const shopListPageMocks = {
  // `pages/shop/list.tsx`
  productList: [
    { id: "prod-3", name: "Smartphone 14 Pro", price: 999.99, originalPrice: 1099.99, discount: 100, stockQuantity: 30, isActive: true, categoryId: "cat-1", storeId: "store-1" },
    { id: "prod-4", name: "Running Shoes", price: 89.99, originalPrice: 120.00, discount: 30, stockQuantity: 100, isActive: true, categoryId: "cat-2", storeId: "store-2" }
  ] as IProductModel[],
  filters: { categories: [{ id: "cat-1", name: "Electronics" }], priceRange: [0, 2000] }
};

export const shopProductCreatePageMocks = {
  // `pages/shop/product/create.tsx`
  productCreateForm: { name: "", description: "", price: 0, originalPrice: 0, stockQuantity: 1, categoryId: "", storeId: "", photos: [] } as IProductModel
};

export const shopProductEditPageMocks = {
  // `pages/shop/product/edit.tsx`
  productEditFormInitialData: { id: "prod-1", name: "Wireless Headphones 2.0", description: "Updated headphones.", price: 189.99, originalPrice: 249.99, stockQuantity: 45, categoryId: "cat-1", storeId: "store-1" } as IProductModel
};

export const shopProductPidPageMocks = {
  // `pages/shop/product/[pid].tsx`
  productDetails: { id: "prod-1", name: "Wireless Headphones", price: 199.99, originalPrice: 249.99, stockQuantity: 50, isActive: true, storeId: "store-1", ratings: 4.5, commentsCount: 1, sizeItems: [{ id: "size-item-1", sizeId: "sz-1", size: { size: "Standard" }, quantity: 50 }], comments: [{ id: "com-1", userName: "Alice", comment: "Great!" }] } as IProductModel,
  availableSizes: [{ id: "sz-1", size: "Standard" }] as ISize[]
};


// --- STORE ---
export const storeIndexPageMocks = {
  // `pages/store/index.tsx`
  storesList: homePageMocks.stores
};

export const storeCreatePageMocks = {
  // `pages/store/create.tsx`
  storeCreateForm: { name: "", description: "", categoryId: "", croppedImages: [] } as IStoreModel
};

export const storeEditPageMocks = {
  // `pages/store/edit.tsx`
  storeEditFormInitialData: { id: "store-1", name: "Tech Haven Global", description: "Updated store desc.", categoryId: "cat-1", croppedImages: [] } as IStoreModel
};

export const storeIdPageMocks = {
  // `pages/store/[id].tsx`
  storeDetails: { id: "store-1", name: "Tech Haven", description: "Latest gadgets.", imgUrl: "https://example.com/tech.jpg", categoryId: "cat-1", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as IStoreResponseModel,
  storeProducts: shopListPageMocks.productList
};


// --- CART & PAYMENT ---
export const cartIndexPageMocks = {
  // `pages/cart/index.tsx`
  cartItems: [
    { id: "prod-1", name: "Wireless Headphones", price: 199.99, originalPrice: 249.99, discount: 20, cartQuantity: 2, size: "One Size" }
  ] as CartItem[],
  summary: { subtotal: 399.98, shipping: 10.00, total: 409.98 }
};

export const paymentCheckoutwithstripePageMocks = {
  // `pages/payment/checkoutwithstripe.tsx`
  checkoutDetails: { clientSecret: "pi_123456789_secret_0987654321", amount: 409.98, currency: "usd" }
};


// --- ORDERS, RETURNS & FAVORITES ---
export const ordersIndexPageMocks = {
  // `pages/orders/index.tsx` (Admin/All orders)
  allOrdersList: [
    { id: "ord-1", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), orderItems: [{ id: "oi-1", productId: "prod-1", quantity: 1, price: 199.99 }] }
  ] as IOrder[]
};

export const ordersUserIndexPageMocks = {
  // `pages/orders/user/index.tsx` (Current user orders)
  userOrdersList: ordersIndexPageMocks.allOrdersList
};

export const returnsIndexPageMocks = {
  // `pages/returns/index.tsx`
  returnRequestsList: [{ id: "ret-1", orderId: "ord-1", productId: "prod-1", reason: "Defective", status: "Pending", createdAt: new Date().toISOString() }]
};

export const favoritesIndexPageMocks = {
  // `pages/favorites/index.tsx`
  favoriteProducts: [shopProductPidPageMocks.productDetails]
};


// --- CATEGORIES & SUBCATEGORIES ---
export const categoriesIndexPageMocks = {
  // `pages/categories/index.tsx`
  categoriesList: [{ id: "cat-1", name: "Electronics", description: "Gadgets.", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }] as ICategories[]
};

export const categoriesCreatePageMocks = {
  // `pages/categories/create.tsx`
  categoryCreateForm: { name: "", description: "" } as ICategories
};

export const categoriesEditPageMocks = {
  // `pages/categories/edit.tsx`
  categoryEditFormInitialData: { id: "cat-1", name: "Electronics (Updated)", description: "Gadgets.", isActive: true } as ICategories
};

export const subcategoriesIndexPageMocks = {
  // `pages/subcategories/index.tsx`
  subCategoriesList: [{ id: "sub-1", name: "Smartphones", description: "Phones.", categoryId: "cat-1", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }] as ISubCategories[]
};

export const subcategoriesCreatePageMocks = {
  // `pages/subcategories/create.tsx`
  subcategoryCreateForm: { name: "", description: "", categoryId: "" } as ISubCategories
};

export const subcategoriesEditPageMocks = {
  // `pages/subcategories/edit.tsx`
  subcategoryEditFormInitialData: { id: "sub-1", name: "Smartphones 5G", description: "Phones.", categoryId: "cat-1", isActive: true } as ISubCategories
};


// --- USERS, ROLES & PERMISSIONS ---
export const usersIndexPageMocks = {
  // `pages/users/index.tsx`
  usersList: [profilePageMocks.userProfile]
};

export const usersCreatePageMocks = {
  // `pages/users/create.tsx`
  userCreateForm: { email: "", name: "", password: "" }
};

export const usersEditPageMocks = {
  // `pages/users/edit.tsx`
  userEditFormInitialData: profilePageMocks.userProfile
};

export const rolesIndexPageMocks = {
  // `pages/roles/index.tsx`
  rolesList: [{ id: "role-1", name: "Admin", permissions: ["manage_users"] }]
};

export const rolesCreatePageMocks = {
  // `pages/roles/create.tsx`
  roleCreateForm: { name: "", permissions: [] }
};

export const rolesEditPageMocks = {
  // `pages/roles/edit.tsx`
  roleEditFormInitialData: { id: "role-1", name: "Super Admin", permissions: ["manage_users", "manage_all"] }
};

export const rolesAssignmentIndexPageMocks = {
  // `pages/roles/Assignment/index.tsx`
  roleAssignmentList: [{ userId: "user-1", userName: "John", roleId: "role-1", roleName: "Admin" }]
};

export const rolesAssignmentUsersPageMocks = {
  // `pages/roles/Assignment/users.tsx`
  assignRoleForm: { userId: "user-2", roleId: "role-1" }
};

export const permissionsIndexPageMocks = {
  // `pages/permissions/index.tsx`
  permissionsList: [{ id: "perm-1", name: "manage_users", description: "Can manage users." }]
};

export const permissionsCreatePageMocks = {
  // `pages/permissions/create.tsx`
  permissionCreateForm: { name: "", description: "" }
};

export const permissionsEditPageMocks = {
  // `pages/permissions/edit.tsx`
  permissionEditFormInitialData: { id: "perm-1", name: "manage_users_v2", description: "Updated desc." }
};


// --- PROMOTIONS ---
export const promotionsIndexPageMocks = {
  // `pages/promotions/index.tsx`
  promotionsList: [{ id: "promo-1", code: "SUMMER20", discountPercentage: 20, isActive: true, expiresAt: "2024-08-31T23:59:59Z" }]
};

export const promotionsCreatePageMocks = {
  // `pages/promotions/create.tsx`
  promotionCreateForm: { code: "", discountPercentage: 0, isActive: true, expiresAt: "" }
};

export const promotionsEditPageMocks = {
  // `pages/promotions/edit.tsx`
  promotionEditFormInitialData: { id: "promo-1", code: "SUMMER25", discountPercentage: 25, isActive: true, expiresAt: "2024-09-15T23:59:59Z" }
};


// --- ARTICLES & COMMENTS ---
export const articlesIndexPageMocks = {
  // `pages/articles/index.tsx`
  articlesDashboard: { totalArticles: 10, recentDrafts: 2 }
};

export const articlesListPageMocks = {
  // `pages/articles/list.tsx`
  articlesList: [
    { id: "article-1", title: "Top 10 Gadgets", text: "Review...", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), user: { id: "user-1", name: "John Doe" } }
  ] as IArticleModelWithUser[]
};

export const articlesPidPageMocks = {
  // `pages/articles/[pid].tsx`
  articleDetails: { id: "article-1", title: "Top 10 Gadgets", text: "Full review...", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), userId: "user-1" } as IArticleModel
};

export const articlesCreatePageMocks = {
  // `pages/articles/create.tsx`
  articleCreateForm: { title: "", text: "", userId: "user-1" }
};

export const articlesEditPageMocks = {
  // `pages/articles/edit.tsx`
  articleEditFormInitialData: { id: "article-1", title: "Top 10 Gadgets Updated", text: "Full review updated...", userId: "user-1" }
};

export const commentsIndexPageMocks = {
  // `pages/comments/index.tsx`
  commentsList: [{ id: "com-1", productId: "prod-1", userName: "Alice", comment: "Great sound quality!", date: new Date().toISOString() }]
};


// --- SYSTEM: SIZES, SHIPPING, TAXES, PACKAGES, ANALYTICS ---
export const sizesIndexPageMocks = {
  // `pages/sizes/index.tsx`
  sizesList: [{ id: "sz-1", size: "Small" }, { id: "sz-2", size: "Medium" }] as ISize[]
};

export const shippingIndexPageMocks = {
  // `pages/shipping/index.tsx`
  shippingMethodsList: [{ id: "ship-1", name: "Standard", cost: 5.99, estimatedDays: "3-5" }]
};

export const taxesIndexPageMocks = {
  // `pages/taxes/index.tsx`
  taxRatesList: [{ id: "tax-1", region: "California", rate: 7.25 }]
};

export const packagesIndexPageMocks = {
  // `pages/packages/index.tsx`
  subscriptionPackagesList: plansPageMocks.plansList
};

export const analyticsIndexPageMocks = {
  // `pages/analytics/index.tsx`
  salesData: [{ date: "2024-01-01", sales: 1200 }],
  visitorStats: { daily: 500, weekly: 3500, monthly: 15000 }
};


// --- DEMO / DEV PAGES ---
export const permissionDemoPageMocks = {
  // `pages/permission-demo.tsx`
  demoPermissions: ["read_users", "write_products"]
};

export const testPermissionsPageMocks = {
  // `pages/test-permissions.tsx`
  testResult: { success: true, allowed: true }
};

export const navigationDemoPageMocks = {
  // `pages/navigation-demo.tsx`
  navItems: [{ label: "Home", href: "/" }]
};

export const tableDemoPageMocks = {
  // `pages/table-demo.tsx`
  tableData: [{ id: 1, name: "Item A" }]
};

export const styleTestPageMocks = {
  // `pages/style-test.tsx`
  styleConfig: { theme: "dark" }
};

export const scssTestPageMocks = {
  // `pages/scss-test.tsx`
  scssConfig: { primaryColor: "#000" }
};
