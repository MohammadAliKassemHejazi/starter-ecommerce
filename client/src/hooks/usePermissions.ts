import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { PERMISSIONS, ROLES, ROUTE_PERMISSIONS } from '@/constants/permissions';

export const usePermissions = () => {
  const user = useSelector((state: RootState) => state.user);
  const userRoles = user?.roles || [];
  const userPermissions = user?.permissions || [];
  const isAuthenticated = user?.isAuthenticated || false;

  // Check if user is anonymous (not authenticated)
  const isAnonymous = (): boolean => {
    return !isAuthenticated;
  };

  // Shopping permissions that don't require authentication
  const canShopAnonymously = (): boolean => {
    return true; // Anyone can shop anonymously
  };

  const hasRole = (roleName: string): boolean => {
    // Anonymous users have no roles
    if (isAnonymous()) { return false; }
    // Super admin has access to everything
    if (isSuperAdmin()) { return true };
    // Admin has access to their own system
    if (isAdmin() && roleName !== ROLES.SUPER_ADMIN) { return true };
    return userRoles.some(role => role.name === roleName);
  };

  const hasPermission = (permissionName: string): boolean => {
    // Anonymous users can only access shopping permissions
    if (isAnonymous()) {
      const shoppingPermissions = [
        PERMISSIONS.VIEW_PRODUCTS,
        PERMISSIONS.VIEW_CATEGORIES,
        PERMISSIONS.VIEW_SUBCATEGORIES,
        PERMISSIONS.VIEW_STORES,
        PERMISSIONS.VIEW_ARTICLES,
        PERMISSIONS.VIEW_COMMENTS,
        PERMISSIONS.VIEW_FAVORITES,
      ];
      return shoppingPermissions.includes(permissionName as any);
    }
    // Super admin has access to everything
    if (isSuperAdmin()) { return true };
    // Admin has access to their own system
    if (isAdmin()) { return true };
    return userPermissions.some(permission => permission.name === permissionName);
  };

  const hasAnyRole = (roleNames: string[]): boolean => {
    // Super admin has access to everything
    if (isSuperAdmin()) { return true };
    // Admin has access to their own system
    if (isAdmin()) { return true };
    return roleNames.some(roleName => hasRole(roleName));
  };

  const hasAnyPermission = (permissionNames: string[]): boolean => {
    // Super admin has access to everything
    if (isSuperAdmin()) { return true };
    // Admin has access to their own system
    if (isAdmin()) { return true };
    return permissionNames.some(permissionName => hasPermission(permissionName));
  };

  const hasAllRoles = (roleNames: string[]): boolean => {
    // Super admin has access to everything
    if (isSuperAdmin()) { return true };
    // Admin has access to their own system
    if (isAdmin()) { return true };
    return roleNames.every(roleName => hasRole(roleName));
  };

  const hasAllPermissions = (permissionNames: string[]): boolean => {
    // Super admin has access to everything
    if (isSuperAdmin()) { return true };
    // Admin has access to their own system
    if (isAdmin()) { return true };
    return permissionNames.every(permissionName => hasPermission(permissionName));
  };

  const isAdmin = (): boolean => {
    return userRoles.some(role => role.name === ROLES.ADMIN);
  };

  const isSuperAdmin = (): boolean => {
    return userRoles.some(role => role.name === ROLES.SUPER_ADMIN);
  };

  const isVendor = (): boolean => {
    return userRoles.some(role => role.name === ROLES.VENDOR || role.name === ROLES.STORE_OWNER);
  };

  const isCustomer = (): boolean => {
    return userRoles.some(role => role.name === ROLES.CUSTOMER || role.name === ROLES.USER);
  };

  // Check if user can access a specific route
  const canAccessRoute = (route: string): boolean => {
    const routePermissions = ROUTE_PERMISSIONS[route as keyof typeof ROUTE_PERMISSIONS];
    
    if (!routePermissions) {
      return true; // Route not in our permission list, allow access
    }

    // Convert to string array to avoid type issues
    const permissionsArray = [...routePermissions] as string[];

    // If route requires roles
    const roleValues = Object.values(ROLES);
    if (permissionsArray.some((role: string) => roleValues.includes(role as any))) {
      const requiredRoles = permissionsArray.filter((role: string) => roleValues.includes(role as any));
      return hasAnyRole(requiredRoles);
    }

    // If route requires permissions
    const permissionValues = Object.values(PERMISSIONS);
    if (permissionsArray.some((permission: string) => permissionValues.includes(permission as any))) {
      const requiredPermissions = permissionsArray.filter((permission: string) => permissionValues.includes(permission as any));
      return hasAnyPermission(requiredPermissions);
    }

    return true; // No specific requirements
  };

  // Route access control for SaaS
  const canAccess = (requiredRoles?: string[], requiredPermissions?: string[]): boolean => {
    // Anonymous users can only access shopping routes
    if (isAnonymous()) {
      const shoppingRoutes = [
        '/',
        '/about',
        '/shop',
        '/cart',
        '/categories',
        '/shop/product'
      ];
      // Allow access to shopping routes without authentication
      return true; // We'll handle this in the component level
    }
    
    // Super admin can access everything
    if (isSuperAdmin()) { return true };
    
    // Admin can access their own system (except super admin routes)
    if (isAdmin()) { 
      // Block super admin routes
      if (requiredRoles?.includes(ROLES.SUPER_ADMIN)) { return false; }
      return true; 
    }
    
    if (requiredRoles && requiredRoles.length > 0) {
      return hasAnyRole(requiredRoles);
    }
    
    if (requiredPermissions && requiredPermissions.length > 0) {
      return hasAnyPermission(requiredPermissions);
    }
    
    return true; // No specific requirements
  };

  // Check if user can access checkout (requires authentication)
  const canCheckout = (): boolean => {
    return isAuthenticated;
  };

  // Check if user can manage a specific resource
  const canManage = (resource: string): boolean => {
    const managePermissions = {
      users: [PERMISSIONS.READ_USERS, PERMISSIONS.CREATE_USERS, PERMISSIONS.UPDATE_USERS, PERMISSIONS.DELETE_USERS],
      roles: [PERMISSIONS.READ_ROLES, PERMISSIONS.CREATE_ROLES, PERMISSIONS.UPDATE_ROLES, PERMISSIONS.DELETE_ROLES],
      permissions: [PERMISSIONS.READ_PERMISSIONS, PERMISSIONS.CREATE_PERMISSIONS, PERMISSIONS.UPDATE_PERMISSIONS, PERMISSIONS.DELETE_PERMISSIONS],
      products: [PERMISSIONS.READ_PRODUCTS, PERMISSIONS.CREATE_PRODUCTS, PERMISSIONS.UPDATE_PRODUCTS, PERMISSIONS.DELETE_PRODUCTS],
      orders: [PERMISSIONS.READ_ORDERS, PERMISSIONS.CREATE_ORDERS, PERMISSIONS.UPDATE_ORDERS, PERMISSIONS.DELETE_ORDERS],
      categories: [PERMISSIONS.READ_CATEGORIES, PERMISSIONS.CREATE_CATEGORIES, PERMISSIONS.UPDATE_CATEGORIES, PERMISSIONS.DELETE_CATEGORIES],
      stores: [PERMISSIONS.READ_STORES, PERMISSIONS.CREATE_STORES, PERMISSIONS.UPDATE_STORES, PERMISSIONS.DELETE_STORES],
    };

    const permissions = managePermissions[resource as keyof typeof managePermissions];
    if (!permissions) { return false };

    return hasAnyPermission(permissions);
  };

  // Check if user can view a specific resource
  const canView = (resource: string): boolean => {
    const viewPermissions = {
      users: PERMISSIONS.VIEW_USERS,
      roles: PERMISSIONS.VIEW_ROLES,
      permissions: PERMISSIONS.VIEW_PERMISSIONS,
      products: PERMISSIONS.VIEW_PRODUCTS,
      orders: PERMISSIONS.VIEW_ORDERS,
      categories: PERMISSIONS.VIEW_CATEGORIES,
      stores: PERMISSIONS.VIEW_STORES,
      analytics: PERMISSIONS.VIEW_ANALYTICS,
      dashboard: PERMISSIONS.VIEW_DASHBOARD,
      audit_logs: PERMISSIONS.VIEW_AUDIT_LOGS,
    };

    const permission = viewPermissions[resource as keyof typeof viewPermissions];
    if (!permission) { return false };

    return hasPermission(permission);
  };

  return {
    hasRole,
    hasPermission,
    hasAnyRole,
    hasAnyPermission,
    hasAllRoles,
    hasAllPermissions,
    isAdmin,
    isSuperAdmin,
    isVendor,
    isCustomer,
    isAnonymous,
    canShopAnonymously,
    canCheckout,
    canAccess,
    canAccessRoute,
    canManage,
    canView,
    userRoles,
    userPermissions,
    isAuthenticated,
    // Helper properties
    user,
    userId: user?.id,
    userEmail: user?.email,
    userName: user?.name,
  };
};
