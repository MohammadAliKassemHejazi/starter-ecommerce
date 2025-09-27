// Permission constants for consistent permission checking
export const PERMISSIONS = {
  // User management
  READ_USERS: 'read_users',
  CREATE_USERS: 'create_users',
  UPDATE_USERS: 'update_users',
  DELETE_USERS: 'delete_users',
  VIEW_USERS: 'view_users',
  EDIT_USERS: 'edit_users',

  // Role management
  READ_ROLES: 'read_roles',
  CREATE_ROLES: 'create_roles',
  UPDATE_ROLES: 'update_roles',
  DELETE_ROLES: 'delete_roles',
  VIEW_ROLES: 'view_roles',
  EDIT_ROLES: 'edit_roles',

  // Permission management
  READ_PERMISSIONS: 'read_permissions',
  CREATE_PERMISSIONS: 'create_permissions',
  UPDATE_PERMISSIONS: 'update_permissions',
  DELETE_PERMISSIONS: 'delete_permissions',
  VIEW_PERMISSIONS: 'view_permissions',
  EDIT_PERMISSIONS: 'edit_permissions',

  // Product management
  READ_PRODUCTS: 'read_products',
  CREATE_PRODUCTS: 'create_products',
  UPDATE_PRODUCTS: 'update_products',
  DELETE_PRODUCTS: 'delete_products',
  VIEW_PRODUCTS: 'view_products',
  EDIT_PRODUCTS: 'edit_products',

  // Order management
  READ_ORDERS: 'read_orders',
  CREATE_ORDERS: 'create_orders',
  UPDATE_ORDERS: 'update_orders',
  DELETE_ORDERS: 'delete_orders',
  VIEW_ORDERS: 'view_orders',
  EDIT_ORDERS: 'edit_orders',

  // Category management
  READ_CATEGORIES: 'read_categories',
  CREATE_CATEGORIES: 'create_categories',
  UPDATE_CATEGORIES: 'update_categories',
  DELETE_CATEGORIES: 'delete_categories',
  VIEW_CATEGORIES: 'view_categories',
  EDIT_CATEGORIES: 'edit_categories',

  // Subcategory management
  READ_SUBCATEGORIES: 'read_subcategories',
  CREATE_SUBCATEGORIES: 'create_subcategories',
  UPDATE_SUBCATEGORIES: 'update_subcategories',
  DELETE_SUBCATEGORIES: 'delete_subcategories',
  VIEW_SUBCATEGORIES: 'view_subcategories',
  EDIT_SUBCATEGORIES: 'edit_subcategories',

  // Store management
  READ_STORES: 'read_stores',
  CREATE_STORES: 'create_stores',
  UPDATE_STORES: 'update_stores',
  DELETE_STORES: 'delete_stores',
  VIEW_STORES: 'view_stores',
  EDIT_STORES: 'edit_stores',

  // Cart management
  READ_CARTS: 'read_carts',
  CREATE_CARTS: 'create_carts',
  UPDATE_CARTS: 'update_carts',
  DELETE_CARTS: 'delete_carts',
  VIEW_CARTS: 'view_carts',
  EDIT_CARTS: 'edit_carts',

  // Promotion management
  READ_PROMOTIONS: 'read_promotions',
  CREATE_PROMOTIONS: 'create_promotions',
  UPDATE_PROMOTIONS: 'update_promotions',
  DELETE_PROMOTIONS: 'delete_promotions',
  VIEW_PROMOTIONS: 'view_promotions',
  EDIT_PROMOTIONS: 'edit_promotions',

  // Analytics
  READ_ANALYTICS: 'read_analytics',
  VIEW_ANALYTICS: 'view_analytics',

  // Dashboard
  READ_DASHBOARD: 'read_dashboard',
  VIEW_DASHBOARD: 'view_dashboard',

  // Audit logs
  READ_AUDIT_LOGS: 'read_audit_logs',
  VIEW_AUDIT_LOGS: 'view_audit_logs',

  // Package management
  MANAGE_PACKAGES: 'manage_packages',
  READ_PACKAGES: 'read_packages',
  CREATE_PACKAGES: 'create_packages',
  UPDATE_PACKAGES: 'update_packages',
  DELETE_PACKAGES: 'delete_packages',

  // Shipping management
  MANAGE_SHIPPING: 'manage_shipping',
  READ_SHIPPING: 'read_shipping',
  CREATE_SHIPPING: 'create_shipping',
  UPDATE_SHIPPING: 'update_shipping',
  DELETE_SHIPPING: 'delete_shipping',

  // Size management
  MANAGE_SIZES: 'manage_sizes',
  READ_SIZES: 'read_sizes',
  CREATE_SIZES: 'create_sizes',
  UPDATE_SIZES: 'update_sizes',
  DELETE_SIZES: 'delete_sizes',

  // Tax management
  MANAGE_TAXES: 'manage_taxes',
  READ_TAXES: 'read_taxes',
  CREATE_TAXES: 'create_taxes',
  UPDATE_TAXES: 'update_taxes',
  DELETE_TAXES: 'delete_taxes',

  // Return management
  MANAGE_RETURNS: 'manage_returns',
  READ_RETURNS: 'read_returns',
  CREATE_RETURNS: 'create_returns',
  UPDATE_RETURNS: 'update_returns',
  DELETE_RETURNS: 'delete_returns',

  // Translation management
  MANAGE_TRANSLATIONS: 'manage_translations',
  READ_TRANSLATIONS: 'read_translations',
  CREATE_TRANSLATIONS: 'create_translations',
  UPDATE_TRANSLATIONS: 'update_translations',
  DELETE_TRANSLATIONS: 'delete_translations',

  // Article management
  READ_ARTICLES: 'read_articles',
  CREATE_ARTICLES: 'create_articles',
  UPDATE_ARTICLES: 'update_articles',
  DELETE_ARTICLES: 'delete_articles',
  VIEW_ARTICLES: 'view_articles',
  EDIT_ARTICLES: 'edit_articles',

  // Comment management
  READ_COMMENTS: 'read_comments',
  CREATE_COMMENTS: 'create_comments',
  UPDATE_COMMENTS: 'update_comments',
  DELETE_COMMENTS: 'delete_comments',
  VIEW_COMMENTS: 'view_comments',
  EDIT_COMMENTS: 'edit_comments',

  // Favorites management
  CREATE_FAVORITES: 'create_favorites',
  DELETE_FAVORITES: 'delete_favorites',
  EDIT_FAVORITES: 'edit_favorites',
  READ_FAVORITES: 'read_favorites',
  UPDATE_FAVORITES: 'update_favorites',
  VIEW_FAVORITES: 'view_favorites',

  // Payment management
  VIEW_PAYMENTS: 'view_payments',
  CREATE_PAYMENTS: 'create_payments',
  UPDATE_PAYMENTS: 'update_payments',
  DELETE_PAYMENTS: 'delete_payments',
  READ_PAYMENTS: 'read_payments',
  EDIT_PAYMENTS: 'edit_payments',
} as const;

// Role constants
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  VENDOR: 'vendor',
  STORE_OWNER: 'store_owner',
  CUSTOMER: 'customer',
  USER: 'user',
} as const;

// Permission groups for easier management
export const PERMISSION_GROUPS = {
  USER_MANAGEMENT: [
    PERMISSIONS.READ_USERS,
    PERMISSIONS.CREATE_USERS,
    PERMISSIONS.UPDATE_USERS,
    PERMISSIONS.DELETE_USERS,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.EDIT_USERS,
  ],
  ROLE_MANAGEMENT: [
    PERMISSIONS.READ_ROLES,
    PERMISSIONS.CREATE_ROLES,
    PERMISSIONS.UPDATE_ROLES,
    PERMISSIONS.DELETE_ROLES,
    PERMISSIONS.VIEW_ROLES,
    PERMISSIONS.EDIT_ROLES,
  ],
  PERMISSION_MANAGEMENT: [
    PERMISSIONS.READ_PERMISSIONS,
    PERMISSIONS.CREATE_PERMISSIONS,
    PERMISSIONS.UPDATE_PERMISSIONS,
    PERMISSIONS.DELETE_PERMISSIONS,
    PERMISSIONS.VIEW_PERMISSIONS,
    PERMISSIONS.EDIT_PERMISSIONS,
  ],
  PRODUCT_MANAGEMENT: [
    PERMISSIONS.READ_PRODUCTS,
    PERMISSIONS.CREATE_PRODUCTS,
    PERMISSIONS.UPDATE_PRODUCTS,
    PERMISSIONS.DELETE_PRODUCTS,
    PERMISSIONS.VIEW_PRODUCTS,
    PERMISSIONS.EDIT_PRODUCTS,
  ],
  ORDER_MANAGEMENT: [
    PERMISSIONS.READ_ORDERS,
    PERMISSIONS.CREATE_ORDERS,
    PERMISSIONS.UPDATE_ORDERS,
    PERMISSIONS.DELETE_ORDERS,
    PERMISSIONS.VIEW_ORDERS,
    PERMISSIONS.EDIT_ORDERS,
  ],
  CATEGORY_MANAGEMENT: [
    PERMISSIONS.READ_CATEGORIES,
    PERMISSIONS.CREATE_CATEGORIES,
    PERMISSIONS.UPDATE_CATEGORIES,
    PERMISSIONS.DELETE_CATEGORIES,
    PERMISSIONS.VIEW_CATEGORIES,
    PERMISSIONS.EDIT_CATEGORIES,
  ],
  STORE_MANAGEMENT: [
    PERMISSIONS.READ_STORES,
    PERMISSIONS.CREATE_STORES,
    PERMISSIONS.UPDATE_STORES,
    PERMISSIONS.DELETE_STORES,
    PERMISSIONS.VIEW_STORES,
    PERMISSIONS.EDIT_STORES,
  ],
  ANALYTICS: [
    PERMISSIONS.READ_ANALYTICS,
    PERMISSIONS.VIEW_ANALYTICS,
  ],
  DASHBOARD: [
    PERMISSIONS.READ_DASHBOARD,
    PERMISSIONS.VIEW_DASHBOARD,
  ],
  AUDIT_LOGS: [
    PERMISSIONS.READ_AUDIT_LOGS,
    PERMISSIONS.VIEW_AUDIT_LOGS,
  ],
} as const;

// Route permissions mapping
export const ROUTE_PERMISSIONS = {
  '/admin': [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  '/admin/users': [PERMISSIONS.VIEW_USERS],
  '/admin/roles': [PERMISSIONS.VIEW_ROLES],
  '/admin/permissions': [PERMISSIONS.VIEW_PERMISSIONS],
  '/admin/products': [PERMISSIONS.VIEW_PRODUCTS],
  '/admin/orders': [PERMISSIONS.VIEW_ORDERS],
  '/admin/categories': [PERMISSIONS.VIEW_CATEGORIES],
  '/admin/stores': [PERMISSIONS.VIEW_STORES],
  '/admin/analytics': [PERMISSIONS.VIEW_ANALYTICS],
  '/admin/dashboard': [PERMISSIONS.VIEW_DASHBOARD],
  '/admin/audit-logs': [PERMISSIONS.VIEW_AUDIT_LOGS],
  '/vendor': [ROLES.VENDOR, ROLES.STORE_OWNER],
  '/vendor/dashboard': [PERMISSIONS.VIEW_DASHBOARD],
  '/vendor/products': [PERMISSIONS.VIEW_PRODUCTS],
  '/vendor/orders': [PERMISSIONS.VIEW_ORDERS],
  '/shop': [], // Public access
  '/cart': [], // Public access
  '/checkout': [ROLES.CUSTOMER, ROLES.USER], // Requires authentication
} as const;
