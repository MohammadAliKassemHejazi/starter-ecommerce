import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

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
    if (isAdmin() && roleName !== 'super_admin') { return true };
    return userRoles.some(role => role.name === roleName);
  };

  const hasPermission = (permissionName: string): boolean => {
    // Anonymous users can only access shopping permissions
    if (isAnonymous()) {
      const shoppingPermissions = [
        'view_products',
        'view_categories',
        'add_to_cart',
        'view_cart',
        'browse_shop'
      ];
      return shoppingPermissions.includes(permissionName);
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
    return userRoles.some(role => role.name === 'admin');
  };

  const isSuperAdmin = (): boolean => {
    return userRoles.some(role => role.name === 'super_admin');
  };

  const isVendor = (): boolean => {
    return userRoles.some(role => role.name === 'vendor' || role.name === 'store_owner');
  };

  const isCustomer = (): boolean => {
    return userRoles.some(role => role.name === 'customer' || role.name === 'user');
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
      if (requiredRoles?.includes('super_admin')) { return false; }
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
    userRoles,
    userPermissions,
    isAuthenticated
  };
};
