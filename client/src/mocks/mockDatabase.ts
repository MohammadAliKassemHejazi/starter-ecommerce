import { IProductModel } from "../models/product.model";
import { IStoreResponseModel, IStoreModel } from "../models/store.model";
import { IArticleModel, IArticleModelWithUser } from "../models/article.model";
import { UserModel } from "../models/user.model";
import { CartItem } from "../models/cart.model";
import { IOrderModel, IOrder } from "../models/order.model";
import { IComment } from "../models/comment.model";
import { ISize, ISizeItem } from "../models/size.model";
import { ICategories, ISubCategories } from "../models/utils.model";

/**
 * Stateful, in-memory mock database.
 * This file holds the "live" arrays of data. As the app creates/edits/deletes items
 * via the mock API layer, these arrays will be mutated, simulating a real backend session.
 */

export const mockDatabase = {
  users: [
    { id: "user-1", email: "admin@example.com", name: "Admin User", address: "123 Main St", phone: "+1234567890", isActive: true, createdAt: new Date().toISOString() },
    { id: "user-2", email: "customer@example.com", name: "John Doe", address: "456 Elm St", phone: "+0987654321", isActive: true, createdAt: new Date().toISOString() }
  ] as UserModel[],

  stores: [
    { id: "store-1", name: "Tech Haven", description: "Latest gadgets and electronics.", imgUrl: "https://example.com/tech-haven.jpg", categoryId: "cat-1", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "store-2", name: "Fashion Hub", description: "Trendy clothing and accessories.", imgUrl: "https://example.com/fashion-hub.jpg", categoryId: "cat-2", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  ] as IStoreResponseModel[],

  products: [
    { id: "prod-1", name: "Wireless Headphones", description: "Noise-cancelling over-ear headphones.", price: 199.99, originalPrice: 249.99, discount: 20, stockQuantity: 50, isActive: true, thumbnail: "https://example.com/headphones.jpg", categoryId: "cat-1", storeId: "store-1", ratings: 4.5, commentsCount: 2 },
    { id: "prod-3", name: "Smartphone 14 Pro", description: "Latest smartphone with amazing camera.", price: 999.99, originalPrice: 1099.99, discount: 100, stockQuantity: 30, isActive: true, thumbnail: "https://example.com/smartphone.jpg", categoryId: "cat-1", storeId: "store-1", ratings: 4.8, commentsCount: 5 },
    { id: "prod-4", name: "Running Shoes", description: "Comfortable and lightweight.", price: 89.99, originalPrice: 120.00, discount: 30, stockQuantity: 100, isActive: true, thumbnail: "https://example.com/shoes.jpg", categoryId: "cat-2", storeId: "store-2", ratings: 4.2, commentsCount: 1 }
  ] as IProductModel[],

  categories: [
    { id: "cat-1", name: "Electronics", description: "Devices, gadgets, and accessories.", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "cat-2", name: "Fashion", description: "Clothing, shoes, and jewelry.", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  ] as ICategories[],

  subcategories: [
    { id: "sub-1", name: "Smartphones", description: "Mobile phones.", categoryId: "cat-1", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "sub-2", name: "Men's Clothing", description: "Apparel for men.", categoryId: "cat-2", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  ] as ISubCategories[],

  articles: [
    { id: "article-1", title: "Top 10 Gadgets 2024", text: "A review of the best gadgets to buy this year...", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), user: { id: "user-1", name: "Admin User" } },
    { id: "article-2", title: "Spring Fashion Trends", text: "What to wear this spring season...", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), user: { id: "user-1", name: "Admin User" } }
  ] as IArticleModelWithUser[],

  cartItems: [
    { id: "prod-1", name: "Wireless Headphones", price: 199.99, originalPrice: 249.99, discount: 20, thumbnail: "https://example.com/headphones.jpg", cartQuantity: 2, size: "One Size" },
    { id: "prod-4", name: "Running Shoes", price: 89.99, originalPrice: 120.00, discount: 30, thumbnail: "https://example.com/shoes.jpg", cartQuantity: 1, size: "10" }
  ] as CartItem[],

  orders: [
    { id: "ord-1", paymentId: "pay-123", customerName: "Admin User", totalPrice: 219.98, status: "Completed", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), orderItems: [{ id: "oi-1", productId: "prod-1", quantity: 1, price: 199.99 }] },
    { id: "ord-2", paymentId: "pay-124", customerName: "John Doe", totalPrice: 89.99, status: "Pending", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), orderItems: [{ id: "oi-2", productId: "prod-4", quantity: 1, price: 89.99 }] }
  ] as IOrderModel[],

  roles: [
    { id: "role-1", name: "Admin", permissions: ["manage_users", "manage_products", "manage_stores"] },
    { id: "role-2", name: "Customer", permissions: [] }
  ],

  permissions: [
    { id: "perm-1", name: "manage_users", description: "Can create, edit, and delete users." },
    { id: "perm-2", name: "manage_products", description: "Can create, edit, and delete products." },
    { id: "perm-3", name: "manage_stores", description: "Can create, edit, and delete stores." }
  ],

  comments: [
    { id: "com-1", productId: "prod-1", userName: "John Doe", comment: "Great sound quality!", date: new Date().toISOString() },
    { id: "com-2", articleId: "article-1", userName: "Customer", comment: "Very informative article.", date: new Date().toISOString() }
  ]
};
