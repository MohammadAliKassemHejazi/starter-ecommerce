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
const delay = (ms: number = 500) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * MOCK API LAYER
 * This acts as the backend server. It provides asynchronous methods that perform CRUD
 * operations on the stateful `mockDatabase` arrays, simulating a real API interaction.
 *
 * Replace real `axios` or `fetch` calls in your services with these methods during development.
 */
export const mockApi = {
  // ============================
  // PRODUCTS
  // ============================
  getProducts: async () => {
    await delay();
    return { data: [...mockDatabase.products], success: true };
  },

  getProductById: async (id: string) => {
    await delay();
    const product = mockDatabase.products.find(p => p.id === id);
    if (!product) { throw new Error("Product not found"); }
    return { data: product, success: true };
  },

  createProduct: async (productData: IProductModel) => {
    await delay();
    const newProduct = {
      ...productData,
      id: `prod-${Date.now()}`,
      isActive: true,
      ratings: 0,
      commentsCount: 0,
    };
    mockDatabase.products.push(newProduct);
    return { data: newProduct, success: true, message: "Product created successfully." };
  },

  updateProduct: async (id: string, productData: Partial<IProductModel>) => {
    await delay();
    const index = mockDatabase.products.findIndex(p => p.id === id);
    if (index === -1) { throw new Error("Product not found"); }

    mockDatabase.products[index] = { ...mockDatabase.products[index], ...productData };
    return { data: mockDatabase.products[index], success: true, message: "Product updated successfully." };
  },

  deleteProduct: async (id: string) => {
    await delay();
    const index = mockDatabase.products.findIndex(p => p.id === id);
    if (index === -1) { throw new Error("Product not found"); }

    mockDatabase.products.splice(index, 1);
    return { success: true, message: "Product deleted successfully." };
  },


  // ============================
  // STORES
  // ============================
  getStores: async () => {
    await delay();
    return { data: [...mockDatabase.stores], success: true };
  },

  getStoreById: async (id: string) => {
    await delay();
    const store = mockDatabase.stores.find(s => s.id === id);
    if (!store) { throw new Error("Store not found"); }
    return { data: store, success: true };
  },

  createStore: async (storeData: IStoreModel) => {
    await delay();
    const newStore: IStoreResponseModel = {
      ...storeData,
      id: `store-${Date.now()}`,
      imgUrl: "https://example.com/placeholder-store.jpg",
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

    mockDatabase.stores.splice(index, 1);
    return { success: true, message: "Store deleted successfully." };
  },


  // ============================
  // CATEGORIES
  // ============================
  getCategories: async () => {
    await delay();
    return { data: [...mockDatabase.categories], success: true };
  },

  createCategory: async (categoryData: ICategories) => {
    await delay();
    const newCategory = {
      ...categoryData,
      id: `cat-${Date.now()}`,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockDatabase.categories.push(newCategory);
    return { data: newCategory, success: true, message: "Category created." };
  },

  updateCategory: async (id: string, categoryData: Partial<ICategories>) => {
    await delay();
    const index = mockDatabase.categories.findIndex(c => c.id === id);
    if (index === -1) { throw new Error("Category not found"); }

    mockDatabase.categories[index] = { ...mockDatabase.categories[index], ...categoryData, updatedAt: new Date().toISOString() };
    return { data: mockDatabase.categories[index], success: true, message: "Category updated." };
  },

  deleteCategory: async (id: string) => {
    await delay();
    const index = mockDatabase.categories.findIndex(c => c.id === id);
    if (index === -1) { throw new Error("Category not found"); }

    mockDatabase.categories.splice(index, 1);
    // Also cleanup subcategories associated
    mockDatabase.subcategories = mockDatabase.subcategories.filter(sub => sub.categoryId !== id);

    return { success: true, message: "Category deleted." };
  },


  // ============================
  // USERS
  // ============================
  getUsers: async () => {
    await delay();
    return { data: [...mockDatabase.users], success: true };
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

  deleteUser: async (id: string) => {
    await delay();
    const index = mockDatabase.users.findIndex(u => u.id === id);
    if (index === -1) { throw new Error("User not found"); }

    mockDatabase.users.splice(index, 1);
    return { success: true, message: "User deleted." };
  },


  // ============================
  // ARTICLES
  // ============================
  getArticles: async () => {
    await delay();
    return { data: [...mockDatabase.articles], success: true };
  },

  createArticle: async (articleData: IArticleModel) => {
    await delay();
    const user = mockDatabase.users.find(u => u.id === articleData.userId);
    const newArticle = {
      ...articleData,
      id: `article-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user: user ? { id: user.id, name: user.name } : { id: "unknown", name: "Unknown" }
    };
    mockDatabase.articles.push(newArticle);
    return { data: newArticle, success: true, message: "Article created." };
  },

  updateArticle: async (id: string, articleData: Partial<IArticleModel>) => {
    await delay();
    const index = mockDatabase.articles.findIndex(a => a.id === id);
    if (index === -1) { throw new Error("Article not found"); }

    mockDatabase.articles[index] = { ...mockDatabase.articles[index], ...articleData, updatedAt: new Date().toISOString() };
    return { data: mockDatabase.articles[index], success: true, message: "Article updated." };
  },

  deleteArticle: async (id: string) => {
    await delay();
    const index = mockDatabase.articles.findIndex(a => a.id === id);
    if (index === -1) { throw new Error("Article not found"); }

    mockDatabase.articles.splice(index, 1);
    return { success: true, message: "Article deleted." };
  }
};
