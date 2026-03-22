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
 * ADVANCED STATEFUL IN-MEMORY DATABASE
 *
 * Provides extensive, realistic datasets mimicking a production e-commerce backend.
 * Includes relationships, varying timestamps, rich text, and diverse states.
 */

// Generate realistic past dates
const d = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

export const mockDatabase = {
  users: [
    { id: "user-superadmin", email: "admin@marketplace.com", name: "System Administrator", address: "1 Admin Way, Tech City", phone: "+18005550001", createdAt: d(400), bio: "Overseeing the entire platform." },
    { id: "user-storeowner1", email: "alice@techhaven.com", name: "Alice Wonderland", address: "123 Silicon Blvd", phone: "+18005550002", createdAt: d(350), bio: "Tech enthusiast and store manager." },
    { id: "user-storeowner2", email: "bob@fashionhub.com", name: "Bob Builder", address: "456 Runway Ave", phone: "+18005550003", createdAt: d(300), bio: "Curating the best fashion trends." },
    { id: "user-customer1", email: "charlie@gmail.com", name: "Charlie Chaplin", address: "789 Movie St", phone: "+18005550004", createdAt: d(150), bio: "Regular shopper." },
    { id: "user-customer2", email: "diana@yahoo.com", name: "Diana Prince", address: "321 Themyscira Island", phone: "+18005550005", createdAt: d(20), bio: "Looking for deals." }
  ] as UserModel[],

  roles: [
    {
      id: "role-1",
      name: "Super Admin",
      permissions: [
        { id: "perm-1", name: "manage_all" },
        { id: "perm-2", name: "read_users" },
        { id: "perm-3", name: "write_users" },
        { id: "perm-4", name: "read_stores" },
        { id: "perm-5", name: "write_stores" },
        { id: "perm-6", name: "read_products" },
        { id: "perm-7", name: "write_products" }
      ]
    },
    {
      id: "role-2",
      name: "Store Owner",
      permissions: [
        { id: "perm-4", name: "read_stores" },
        { id: "perm-5", name: "write_stores" },
        { id: "perm-6", name: "read_products" },
        { id: "perm-7", name: "write_products" }
      ]
    },
    {
      id: "role-3",
      name: "Customer",
      permissions: [
        { id: "perm-6", name: "read_products" },
        { id: "perm-8", name: "write_reviews" }
      ]
    }
  ],

  permissions: [
    { id: "perm-1", name: "manage_all", description: "Absolute control." },
    { id: "perm-2", name: "read_users", description: "View user lists." },
    { id: "perm-3", name: "write_users", description: "Edit users." },
    { id: "perm-4", name: "read_stores", description: "View store details." },
    { id: "perm-5", name: "write_stores", description: "Create/edit stores." },
    { id: "perm-6", name: "write_products", description: "Manage inventory." }
  ],

  categories: [
    { id: "cat-elec", name: "Electronics & Tech", description: "Cutting-edge devices and smart gadgets.", createdAt: d(400), updatedAt: d(400) },
    { id: "cat-fash", name: "Apparel & Fashion", description: "Trendy clothing for all seasons.", createdAt: d(400), updatedAt: d(400) },
    { id: "cat-home", name: "Home & Living", description: "Furniture, decor, and kitchenware.", createdAt: d(380), updatedAt: d(380) }
  ] as ICategories[],

  subcategories: [
    { id: "sub-phones", name: "Smartphones", description: "Latest mobile devices.", categoryId: "cat-elec", createdAt: d(390), updatedAt: d(390) },
    { id: "sub-laptops", name: "Laptops & PCs", description: "Computing powerhouses.", categoryId: "cat-elec", createdAt: d(390), updatedAt: d(390) },
    { id: "sub-shoes", name: "Footwear", description: "Sneakers, boots, and heels.", categoryId: "cat-fash", createdAt: d(390), updatedAt: d(390) },
    { id: "sub-shirts", name: "Tops & Tees", description: "Casual and formal shirts.", categoryId: "cat-fash", createdAt: d(390), updatedAt: d(390) }
  ] as ISubCategories[],

  stores: [
    { id: "store-tech", name: "Tech Haven", description: "Your one-stop shop for premium electronics, offering the latest smartphones, audio gear, and laptops from top brands.", imgUrl: "https://images.unsplash.com/photo-1531297172864-df2240c9b1b1", categoryId: "cat-elec", userId: "user-storeowner1", createdAt: d(340), updatedAt: d(340) },
    { id: "store-fash", name: "Fashion Hub", description: "Curated styles for the modern individual. We source high-quality fabrics and unique designs from global creators.", imgUrl: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04", categoryId: "cat-fash", userId: "user-storeowner2", createdAt: d(290), updatedAt: d(290) },
    { id: "store-home", name: "Cozy Living", description: "Transform your house into a home with our exquisite collection of decor and furniture.", imgUrl: "https://images.unsplash.com/photo-1618220179428-22790b46a013", categoryId: "cat-home", userId: "user-storeowner1", createdAt: d(100), updatedAt: d(50) } // Inactive store
  ] as IStoreResponseModel[],

  sizes: [
    { id: "sz-sm", size: "S" }, { id: "sz-md", size: "M" }, { id: "sz-lg", size: "L" }, { id: "sz-xl", size: "XL" },
    { id: "sz-8", size: "US 8" }, { id: "sz-9", size: "US 9" }, { id: "sz-10", size: "US 10" },
    { id: "sz-univ", size: "Universal" }
  ] as ISize[],

  // Advanced product dataset covering multiple categories, stores, and states (discounts, out of stock)
  products: [
    { id: "prod-101", name: "Quantum X Pro Smartphone", description: "The fastest processor on the market with a revolutionary AI camera system. 256GB storage, 12GB RAM, OLED display.", price: 1099.00, originalPrice: 1299.00, discount: 200, stockQuantity: 150, categoryId: "cat-elec", subcategoryId: "sub-phones", storeId: "store-tech", thumbnail: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9", ratings: 4.8, commentsCount: 45, createdAt: d(100) },
    { id: "prod-102", name: "Noise-Cancelling Earbuds Z", description: "Immersive audio experience with active noise cancellation and 30-hour battery life. Water-resistant.", price: 149.99, originalPrice: 149.99, discount: 0, stockQuantity: 300, categoryId: "cat-elec", storeId: "store-tech", thumbnail: "https://images.unsplash.com/photo-1590658268037-6f5947c66576", ratings: 4.5, commentsCount: 120, createdAt: d(150) },
    { id: "prod-103", name: "UltraBook Pro 15\"", description: "Lightweight powerhouse for professionals. i9 processor, 32GB RAM, 1TB SSD. Built for heavy multitasking.", price: 2199.50, originalPrice: 2499.00, discount: 299.5, stockQuantity: 25, categoryId: "cat-elec", subcategoryId: "sub-laptops", storeId: "store-tech", thumbnail: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853", ratings: 4.9, commentsCount: 8, createdAt: d(80) },
    { id: "prod-201", name: "Classic Denim Jacket", description: "Vintage wash denim jacket with a relaxed fit. Perfect for layering in any season.", price: 89.00, originalPrice: 89.00, discount: 0, stockQuantity: 0, categoryId: "cat-fash", subcategoryId: "sub-shirts", storeId: "store-fash", thumbnail: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531", ratings: 4.2, commentsCount: 15, createdAt: d(200) }, // Out of stock
    { id: "prod-202", name: "Urban Runner Sneakers", description: "Breathable mesh upper with high-rebound cushioning. Designed for city running and casual wear.", price: 120.00, originalPrice: 150.00, discount: 30, stockQuantity: 85, categoryId: "cat-fash", subcategoryId: "sub-shoes", storeId: "store-fash", thumbnail: "https://images.unsplash.com/photo-1542291026-7eec264c27ff", ratings: 4.6, commentsCount: 60, createdAt: d(45) },
    { id: "prod-203", name: "Organic Cotton T-Shirt 3-Pack", description: "Ethically sourced, 100% organic cotton basic tees. Includes black, white, and grey.", price: 45.00, originalPrice: 60.00, discount: 15, stockQuantity: 200, categoryId: "cat-fash", subcategoryId: "sub-shirts", storeId: "store-fash", thumbnail: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab", ratings: 4.7, commentsCount: 33, createdAt: d(300) },
    { id: "prod-301", name: "Modern Ceramic Vase", description: "Minimalist ceramic vase, perfect for dried flowers or as a standalone centerpiece.", price: 35.50, originalPrice: 35.50, discount: 0, stockQuantity: 40, categoryId: "cat-home", storeId: "store-home", thumbnail: "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5", ratings: 4.0, commentsCount: 2, createdAt: d(120) } // Inactive product
  ] as IProductModel[],

  // Linking sizes and inventory amounts to specific products
  productSizes: [
    { id: "ps-1", productId: "prod-201", sizeId: "sz-sm", quantity: 0, size: { size: "S" } },
    { id: "ps-2", productId: "prod-201", sizeId: "sz-md", quantity: 0, size: { size: "M" } },
    { id: "ps-3", productId: "prod-202", sizeId: "sz-8", quantity: 20, size: { size: "US 8" } },
    { id: "ps-4", productId: "prod-202", sizeId: "sz-9", quantity: 35, size: { size: "US 9" } },
    { id: "ps-5", productId: "prod-202", sizeId: "sz-10", quantity: 30, size: { size: "US 10" } },
    { id: "ps-6", productId: "prod-203", sizeId: "sz-lg", quantity: 100, size: { size: "L" } },
    { id: "ps-7", productId: "prod-203", sizeId: "sz-xl", quantity: 100, size: { size: "XL" } }
  ] as (ISizeItem & { productId: string })[],

  comments: [
    { id: "com-101", productId: "prod-101", userName: "Charlie Chaplin", comment: "The camera on this phone is absolutely stunning. Worth every penny.", date: d(10) },
    { id: "com-102", productId: "prod-101", userName: "Diana Prince", comment: "Battery life could be better, but performance is 10/10.", date: d(5) },
    { id: "com-202", productId: "prod-202", userName: "Charlie Chaplin", comment: "Very comfortable for my morning jogs.", date: d(20) },
    { id: "com-art1", articleId: "article-tech1", userName: "Bob Builder", comment: "I disagree with #3, but otherwise a solid list.", date: d(2) }
  ],

  articles: [
    { id: "article-tech1", title: "The Future of Mobile Computing in 2025", content: "As AI integration becomes the standard, our smartphones are transforming into predictive assistants. Let's explore the top trends...", published: true, createdAt: d(30), updatedAt: d(29), author: { id: "user-superadmin", name: "System Administrator", email: "admin@marketplace.com" } },
    { id: "article-fash1", title: "Sustainable Fashion: Why Organic Matters", content: "The textile industry is changing. Consumers are demanding transparency and eco-friendly materials...", published: true, createdAt: d(60), updatedAt: d(60), author: { id: "user-storeowner2", name: "Bob Builder", email: "bob@fashionhub.com" } }
  ] as IArticleModelWithUser[],

  cartItems: [
    { id: "prod-102", name: "Noise-Cancelling Earbuds Z", price: 149.99, originalPrice: 149.99, discount: 0, thumbnail: "https://images.unsplash.com/photo-1590658268037-6f5947c66576", quantity: 1, size: "Universal" },
    { id: "prod-203", name: "Organic Cotton T-Shirt 3-Pack", price: 45.00, originalPrice: 60.00, discount: 15, thumbnail: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab", quantity: 2, size: "L" }
  ] as CartItem[],

  orders: [
    {
      id: "ord-889901",
      userId: "user-customer2",
      storeId: "store-tech1",
      paymentStatus: "Paid",
      paymentMethod: "Stripe",
      shippingAddress: "321 Themyscira Island",
      totalAmount: 1144.00, // 1099 + 45
      status: "Delivered",
      createdAt: d(15),
      updatedAt: d(12),
      items: [
        { id: "oi-1", orderId: "ord-889901", productId: "prod-101", quantity: 1, price: 1099.00 },
        { id: "oi-2", orderId: "ord-889901", productId: "prod-203", quantity: 1, price: 45.00 }
      ]
    },
    {
      id: "ord-889902",
      userId: "user-customer1",
      storeId: "store-fash1",
      paymentStatus: "Pending",
      paymentMethod: "PayPal",
      shippingAddress: "789 Movie St",
      totalAmount: 240.00, // 120 * 2
      status: "Processing",
      createdAt: d(1),
      updatedAt: d(1),
      items: [
        { id: "oi-3", orderId: "ord-889902", productId: "prod-202", quantity: 2, price: 120.00 }
      ]
    }
  ] as IOrderModel[],

  analytics: {
    salesData: [
      { date: d(30).split('T')[0], sales: 3400.50 },
      { date: d(20).split('T')[0], sales: 5120.00 },
      { date: d(10).split('T')[0], sales: 4890.25 },
      { date: d(1).split('T')[0], sales: 6200.00 }
    ],
    visitorStats: {
      daily: 1254,
      weekly: 8760,
      monthly: 34500
    }
  }
};
