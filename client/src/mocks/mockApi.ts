import { mockDatabase } from "./mockDatabase";
import { IProductModel } from "../models/product.model";
import { IStoreResponseModel, IStoreModel } from "../models/store.model";
import { ICategories, ISubCategories } from "../models/utils.model";
import { UserModel } from "../models/user.model";
import { IArticleModel } from "../models/article.model";

/**
 * Utility to simulate network delay.
 * Allows testing loading states in the UI.
 */
const delay = (ms: number = 800) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock Paginated API Response Wrapper (Matches typical backend output)
interface PaginatedResponse<T> {
  success: boolean;
  message?: string;
  data: T[];
  meta: {
    total: number;
    page: number;
    totalPages: number;
    limit: number;
  };
}

// Helper for pagination
const paginate = <T>(array: T[], page: number, limit: number): PaginatedResponse<T> => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const data = array.slice(startIndex, endIndex);
  return {
    success: true,
    data,
    meta: {
      total: array.length,
      page,
      limit,
      totalPages: Math.ceil(array.length / limit)
    }
  };
};

/**
 * ADVANCED MOCK API LAYER
 * This acts as a highly realistic backend server providing query params,
 * pagination, filtering, searching, and relational integrity.
 */
export const mockApi = {
  // ============================
  // PRODUCTS
  // ============================
  getProducts: async (params?: { page?: number; limit?: number; search?: string; categoryId?: string; storeId?: string; isActive?: boolean }): Promise<PaginatedResponse<IProductModel>> => {
    await delay();
    let result = [...mockDatabase.products];

    if (params) {
      if (params.search) {
        const term = params.search.toLowerCase();
        result = result.filter(p => p.name?.toLowerCase().includes(term) || p.description?.toLowerCase().includes(term));
      }
      if (params.categoryId) {
        result = result.filter(p => p.categoryId === params.categoryId);
      }
      if (params.storeId) {
        result = result.filter(p => p.storeId === params.storeId);
      }
      if (params.isActive !== undefined) {
        result = result.filter(p => p.isActive === params.isActive);
      }
    }

    const page = params?.page || 1;
    const limit = params?.limit || 10;
    return paginate(result, page, limit);
  },

  getProductById: async (id: string) => {
    await delay();
    const product = mockDatabase.products.find(p => p.id === id);
    if (!product) { throw new Error("Product not found"); }

    // Resolve relations for advanced view
    const comments = mockDatabase.comments.filter(c => c.productId === id);
    const sizes = mockDatabase.productSizes.filter(s => s.productId === id);
    const store = mockDatabase.stores.find(s => s.id === product.storeId);

    const fullProduct = {
      ...product,
      comments,
      sizeItems: sizes,
      store: store ? { id: store.id, name: store.name, description: store.description } : undefined
    };

    return { data: fullProduct, success: true };
  },

  createProduct: async (productData: IProductModel) => {
    await delay();
    const newProduct = {
      ...productData,
      id: `prod-new-${Date.now()}`,
      isActive: productData.isActive !== false, // default true
      ratings: 0,
      commentsCount: 0,
      createdAt: new Date().toISOString()
    };
    mockDatabase.products.push(newProduct);
    return { data: newProduct, success: true, message: "Product created successfully." };
  },

  updateProduct: async (id: string, productData: Partial<IProductModel>) => {
    await delay();
    const index = mockDatabase.products.findIndex(p => p.id === id);
    if (index === -1) { throw new Error("Product not found"); }

    mockDatabase.products[index] = { ...mockDatabase.products[index], ...productData, updatedAt: new Date().toISOString() };
    return { data: mockDatabase.products[index], success: true, message: "Product updated successfully." };
  },

  deleteProduct: async (id: string) => {
    await delay();
    const index = mockDatabase.products.findIndex(p => p.id === id);
    if (index === -1) { throw new Error("Product not found"); }

    mockDatabase.products.splice(index, 1);
    // Relational cleanup
    mockDatabase.comments = mockDatabase.comments.filter(c => c.productId !== id);
    mockDatabase.productSizes = mockDatabase.productSizes.filter(s => s.productId !== id);

    return { success: true, message: "Product deleted successfully." };
  },


  // ============================
  // STORES
  // ============================
  getStores: async (params?: { page?: number; limit?: number; isActive?: boolean }): Promise<PaginatedResponse<IStoreResponseModel>> => {
    await delay();
    let result = [...mockDatabase.stores];

    if (params && params.isActive !== undefined) {
      result = result.filter(s => s.isActive === params.isActive);
    }

    const page = params?.page || 1;
    const limit = params?.limit || 10;
    return paginate(result, page, limit);
  },

  getStoreById: async (id: string) => {
    await delay();
    const store = mockDatabase.stores.find(s => s.id === id);
    if (!store) { throw new Error("Store not found"); }

    // Also fetch store products for the view
    const products = mockDatabase.products.filter(p => p.storeId === id);

    return { data: { store, products }, success: true };
  },

  createStore: async (storeData: IStoreModel) => {
    await delay();
    const newStore: IStoreResponseModel = {
      ...storeData,
      id: `store-new-${Date.now()}`,
      imgUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockDatabase.stores.push(newStore);
    return { data: newStore, success: true, message: "Store created successfully." };
  },

  updateStore: async (id: string, storeData: Partial<IStoreModel>) => {
    await delay();
    const index = mockDatabase.stores.findIndex(s => s.id === id);
    if (index === -1) { throw new Error("Store not found"); }

    mockDatabase.stores[index] = { ...mockDatabase.stores[index], ...storeData, updatedAt: new Date().toISOString() };
    return { data: mockDatabase.stores[index], success: true, message: "Store updated successfully." };
  },

  deleteStore: async (id: string) => {
    await delay();
    const index = mockDatabase.stores.findIndex(s => s.id === id);
    if (index === -1) { throw new Error("Store not found"); }

    // Optionally set inactive instead of hard delete, or handle cascading.
    // We will simulate hard delete cascading products.
    mockDatabase.stores.splice(index, 1);
    mockDatabase.products = mockDatabase.products.filter(p => p.storeId !== id);

    return { success: true, message: "Store and its products deleted successfully." };
  },


  // ============================
  // USERS
  // ============================
  getUsers: async (params?: { page?: number; limit?: number; search?: string }): Promise<PaginatedResponse<UserModel>> => {
    await delay();
    let result = [...mockDatabase.users];

    if (params?.search) {
      const term = params.search.toLowerCase();
      result = result.filter(u => u.name?.toLowerCase().includes(term) || u.email?.toLowerCase().includes(term));
    }

    const page = params?.page || 1;
    const limit = params?.limit || 10;
    return paginate(result, page, limit);
  },

  getUserById: async (id: string) => {
    await delay();
    const user = mockDatabase.users.find(u => u.id === id);
    if (!user) { throw new Error("User not found"); }
    return { data: user, success: true };
  },

  updateUser: async (id: string, userData: Partial<UserModel>) => {
    await delay();
    const index = mockDatabase.users.findIndex(u => u.id === id);
    if (index === -1) { throw new Error("User not found"); }

    mockDatabase.users[index] = { ...mockDatabase.users[index], ...userData, updatedAt: new Date().toISOString() };
    return { data: mockDatabase.users[index], success: true, message: "User updated." };
  },


  // ============================
  // UTILS / CATEGORIES
  // ============================
  getCategories: async () => {
    await delay(300); // Faster lookup
    return { data: [...mockDatabase.categories], success: true };
  },

  getSubCategories: async (categoryId?: string) => {
    await delay(300);
    let result = [...mockDatabase.subcategories];
    if (categoryId) {
      result = result.filter(sub => sub.categoryId === categoryId);
    }
    return { data: result, success: true };
  },


  // ============================
  // ANALYTICS / ADMIN
  // ============================
  getDashboardStats: async () => {
    await delay();
    return {
      data: {
        totalProducts: mockDatabase.products.length,
        totalStores: mockDatabase.stores.length,
        totalUsers: mockDatabase.users.length,
        totalOrders: mockDatabase.orders.length,
        salesData: mockDatabase.analytics.salesData,
        visitorStats: mockDatabase.analytics.visitorStats,
        recentOrders: mockDatabase.orders.slice(0, 5) // Last 5
      },
      success: true
    };
  }
};
