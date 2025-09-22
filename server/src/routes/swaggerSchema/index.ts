// RLS-based tenant schemas
export * as RLSSchemas from './rls-shop.route.schema';
export * as RLSStoreSchemas from './rls-store.route.schema';
export * as RLSCartSchemas from './rls-cart.route.schema';
export * as RLSOrderSchemas from './rls-order.route.schema';

// Core business schemas
export * as AuthSchemas from './auth.route.schema';
export * as ShopSchemas from './shop.route.schema';
export * as StoreSchemas from './store.route.schema';
export * as CartSchemas from './cart.route.schema';
export * as OrderSchemas from './order.route.schema';
export * as CategorySchemas from './category.route.schema';
export * as UserSchemas from './user.route.schema';
export * as PaymentSchemas from './payment.route.schema';
export * as RoleSchemas from './role.route.schema';

// Additional feature schemas
export * as ArticleSchemas from './article.route.schema';
export * as CommentSchemas from './comments.route.schema';
export * as FavoriteSchemas from './favorites.route.schema';
export * as PackageSchemas from './packages.route.schema';
export * as PromotionSchemas from './promotions.route.schema';
export * as ReturnSchemas from './returns.route.schema';
export * as UsersSchemas from './users.route.schema';

// Import all schemas for easy access
import * as RLSSchemas from './rls-shop.route.schema';
import * as RLSStoreSchemas from './rls-store.route.schema';
import * as RLSCartSchemas from './rls-cart.route.schema';
import * as RLSOrderSchemas from './rls-order.route.schema';
import * as AuthSchemas from './auth.route.schema';
import * as ShopSchemas from './shop.route.schema';
import * as StoreSchemas from './store.route.schema';
import * as CartSchemas from './cart.route.schema';
import * as OrderSchemas from './order.route.schema';
import * as CategorySchemas from './category.route.schema';
import * as UserSchemas from './user.route.schema';
import * as PaymentSchemas from './payment.route.schema';
import * as RoleSchemas from './role.route.schema';
import * as ArticleSchemas from './article.route.schema';
import * as CommentSchemas from './comments.route.schema';
import * as FavoriteSchemas from './favorites.route.schema';
import * as PackageSchemas from './packages.route.schema';
import * as PromotionSchemas from './promotions.route.schema';
import * as ReturnSchemas from './returns.route.schema';
import * as UsersSchemas from './users.route.schema';

// Export all schemas as a single object
export const AllSchemas = {
  // RLS Tenant Schemas
  ...RLSSchemas,
  ...RLSStoreSchemas,
  ...RLSCartSchemas,
  ...RLSOrderSchemas,
  
  // Core Business Schemas
  ...AuthSchemas,
  ...ShopSchemas,
  ...StoreSchemas,
  ...CartSchemas,
  ...OrderSchemas,
  ...CategorySchemas,
  ...UserSchemas,
  ...PaymentSchemas,
  ...RoleSchemas,
  
  // Additional Feature Schemas
  ...ArticleSchemas,
  ...CommentSchemas,
  ...FavoriteSchemas,
  ...PackageSchemas,
  ...PromotionSchemas,
  ...ReturnSchemas,
  ...UsersSchemas
};

export default AllSchemas;
