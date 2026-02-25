import { PERMISSIONS, ROLES } from '@/constants/permissions';

// Type definitions for better type safety
export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];
export type Role = typeof ROLES[keyof typeof ROLES];

// Permission checking utilities
export const permissionUtils = {
  // Check if a permission is a user management permission
  isUserManagementPermission: (permission: string): boolean => {
    return permission.startsWith('read_users') ||
           permission.startsWith('create_users') ||
           permission.startsWith('update_users') ||
           permission.startsWith('delete_users') ||
           permission.startsWith('view_users') ||
           permission.startsWith('edit_users');
  },

  // Check if a permission is a product management permission
  isProductManagementPermission: (permission: string): boolean => {
    return permission.startsWith('read_products') ||
           permission.startsWith('create_products') ||
           permission.startsWith('update_products') ||
           permission.startsWith('delete_products') ||
           permission.startsWith('view_products') ||
           permission.startsWith('edit_products');
  },

  // Check if a permission is a read-only permission
  isReadOnlyPermission: (permission: string): boolean => {
    return permission.startsWith('read_') || permission.startsWith('view_');
  },

  // Check if a permission is a write permission
  isWritePermission: (permission: string): boolean => {
    return permission.startsWith('create_') || 
           permission.startsWith('update_') || 
           permission.startsWith('delete_') || 
           permission.startsWith('edit_');
  },

  // Get permission category
  getPermissionCategory: (permission: string): string => {
    if (permission.includes('users')) { return 'users' };
    if (permission.includes('roles')) { return 'roles' };
    if (permission.includes('permissions')) { return 'permissions' };
    if (permission.includes('products')) { return 'products' };
    if (permission.includes('orders')) { return 'orders' };
    if (permission.includes('categories')) { return 'categories' };
    if (permission.includes('stores')) { return 'stores' };
    if (permission.includes('carts')) { return 'carts' };
    if (permission.includes('promotions')) { return 'promotions' };
    if (permission.includes('analytics')) { return 'analytics' };
    if (permission.includes('dashboard')) { return 'dashboard' };
    if (permission.includes('audit_logs')) {return 'audit_logs'};
    if (permission.includes('packages')) {return 'packages'};
    if (permission.includes('shipping')) {return 'shipping'};
    if (permission.includes('sizes')){ return 'sizes'};
    if (permission.includes('taxes')) {return 'taxes'};
    if (permission.includes('returns')) {return 'returns'};
    if (permission.includes('translations')) {return 'translations'};
    if (permission.includes('articles')) {return 'articles'};
    if (permission.includes('comments')) {return 'comments'};
    if (permission.includes('favorites')) {return 'favorites'};
    if (permission.includes('payments')) {return 'payments'};
    return 'other';
  },

  // Get permission action
  getPermissionAction: (permission: string): string => {
    if (permission.startsWith('read_')) {return 'read'};
    if (permission.startsWith('create_'))  {return 'create'};
    if (permission.startsWith('update_'))  {return 'update'};
    if (permission.startsWith('delete_'))  {return 'delete'};
    if (permission.startsWith('view_'))  {return 'view'};
    if (permission.startsWith('edit_'))  {return 'edit'};
    if (permission.startsWith('manage_'))  {return 'manage'};
    return 'unknown';
  },

  // Check if role is admin level
  isAdminRole: (role: string): boolean => {
    return role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN;
  },

  // Check if role is vendor level
  isVendorRole: (role: string): boolean => {
    return role === ROLES.VENDOR || role === ROLES.STORE_OWNER;
  },

  // Check if role is customer level
  isCustomerRole: (role: string): boolean => {
    return role === ROLES.CUSTOMER || role === ROLES.USER;
  },

  // Get role level (higher number = more privileges)
  getRoleLevel: (role: string): number => {
    switch (role) {
      case ROLES.SUPER_ADMIN: return 100;
      case ROLES.ADMIN: return 80;
      case ROLES.VENDOR: return 60;
      case ROLES.STORE_OWNER: return 50;
      case ROLES.CUSTOMER: return 20;
      case ROLES.USER: return 10;
      default: return 0;
    }
  },

  // Check if one role has higher privileges than another
  hasHigherPrivileges: (role1: string, role2: string): boolean => {
    return permissionUtils.getRoleLevel(role1) > permissionUtils.getRoleLevel(role2);
  },

  // Get all permissions for a specific resource
  getResourcePermissions: (resource: string): Permission[] => {
    const resourcePermissions = Object.values(PERMISSIONS).filter(permission => 
      permission.includes(resource)
    );
    return resourcePermissions as Permission[];
  },

  // Get all read permissions for a specific resource
  getResourceReadPermissions: (resource: string): Permission[] => {
    return permissionUtils.getResourcePermissions(resource).filter(permission => 
      permission.startsWith('read_') || permission.startsWith('view_')
    );
  },

  // Get all write permissions for a specific resource
  getResourceWritePermissions: (resource: string): Permission[] => {
    return permissionUtils.getResourcePermissions(resource).filter(permission => 
      permission.startsWith('create_') || 
      permission.startsWith('update_') || 
      permission.startsWith('delete_') || 
      permission.startsWith('edit_')
    );
  },

  // Check if permission is required for a specific action
  isPermissionRequiredForAction: (action: string, resource: string): boolean => {
    const actionMap: { [key: string]: string } = {
      'view': 'view_',
      'read': 'read_',
      'create': 'create_',
      'update': 'update_',
      'edit': 'edit_',
      'delete': 'delete_',
      'manage': 'manage_'
    };

    const prefix = actionMap[action.toLowerCase()];
    if (!prefix) { return false };

    return Object.values(PERMISSIONS).some(permission => 
      permission.startsWith(prefix) && permission.includes(resource)
    );
  },

  // Get the required permission for a specific action on a resource
  getRequiredPermission: (action: string, resource: string): Permission | null => {
    const actionMap: { [key: string]: string } = {
      'view': 'view_',
      'read': 'read_',
      'create': 'create_',
      'update': 'update_',
      'edit': 'edit_',
      'delete': 'delete_',
      'manage': 'manage_'
    };

    const prefix = actionMap[action.toLowerCase()];
    if (!prefix) { return null };

    const permission = Object.values(PERMISSIONS).find(perm => 
      perm.startsWith(prefix) && perm.includes(resource)
    );

    return permission as Permission || null;
  }
};

// Export individual functions for convenience
export const {
  isUserManagementPermission,
  isProductManagementPermission,
  isReadOnlyPermission,
  isWritePermission,
  getPermissionCategory,
  getPermissionAction,
  isAdminRole,
  isVendorRole,
  isCustomerRole,
  getRoleLevel,
  hasHigherPrivileges,
  getResourcePermissions,
  getResourceReadPermissions,
  getResourceWritePermissions,
  isPermissionRequiredForAction,
  getRequiredPermission
} = permissionUtils;
