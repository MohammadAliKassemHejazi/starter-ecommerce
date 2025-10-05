import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { PERMISSIONS, ROLES, ROUTE_PERMISSIONS } from '@/constants/permissions';
import { isAuthenticatingSelector, userSelector } from '@/store/slices/userSlice';

// Helper: Check if a value is one of the known roles
const isKnownRole = (value: string): value is keyof typeof ROLES =>
  Object.values(ROLES).includes(value as any);

// Helper: Check if a value is one of the known permissions
const isKnownPermission = (value: string): value is keyof typeof PERMISSIONS =>
  Object.values(PERMISSIONS).includes(value as any);

export const usePermissions = () => {
  
  const user = useSelector(userSelector);
const isAuthenticatingvalue = useSelector(isAuthenticatingSelector);
  // Memoize derived user state
  const {
    isAuthenticated,
    userRoles,
    userPermissions,
    subscription,
    id: userId,
    email: userEmail,
    name: userName,
    isAuthenticating,
  } = useMemo(() => {
    return {
      isAuthenticated: !!user?.isAuthenticated,
      userRoles: user?.roles || [],
      userPermissions: user?.permissions || [],
      subscription: user?.subscription,
      id: user?.id,
      email: user?.email,
      name: user?.name,
      isAuthenticating: isAuthenticatingvalue,
    };
  }, [user,isAuthenticatingvalue]);

  // Role checks (memoized for efficiency)
  const isSuperAdmin = useMemo(
    () => userRoles.some((role) => role.name === ROLES.SUPER_ADMIN),
    [userRoles]
  );

  const isAdmin = useMemo(
    () => userRoles.some((role) => role.name === ROLES.ADMIN),
    [userRoles]
  );

  const isVendor = useMemo(
    () =>
      userRoles.some(
        (role) =>
          role.name === ROLES.VENDOR || role.name === ROLES.STORE_OWNER
      ),
    [userRoles]
  );

  const isCustomer = useMemo(
    () =>
      userRoles.some(
        (role) => role.name === ROLES.CUSTOMER || role.name === ROLES.USER
      ),
    [userRoles]
  );

  const isAnonymous = !isAuthenticated;

  // Permission helpers
  const hasRole = (roleName: string): boolean => {
    if (isAnonymous) {return false;}
    if (isSuperAdmin) {return true;}
    if (isAdmin && roleName !== ROLES.SUPER_ADMIN) {return true;}
    return userRoles.some((role) => role.name === roleName);
  };

  const hasPermission = (permissionName: string): boolean => {
    if (isAnonymous) {
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

    if (isSuperAdmin || isAdmin) {return true;}
    return userPermissions.some((perm) => perm.name === permissionName);
  };

  // Bulk checks
  const hasAnyRole = (roleNames: string[]): boolean => {
    if (isSuperAdmin || isAdmin) {return true;}
    return roleNames.some(hasRole);
  };

  const hasAllRoles = (roleNames: string[]): boolean => {
    if (isSuperAdmin || isAdmin) {return true;}
    return roleNames.every(hasRole);
  };

  const hasAnyPermission = (permissionNames: string[]): boolean => {
    if (isSuperAdmin || isAdmin) {return true;}
    return permissionNames.some(hasPermission);
  };

  const hasAllPermissions = (permissionNames: string[]): boolean => {
    if (isSuperAdmin || isAdmin) {return true;}
    return permissionNames.every(hasPermission);
  };

  // Subscription & action logic
  const hasActiveSubscription = useMemo(() => {
    if (!isAuthenticated) {return false;}
    if (isSuperAdmin || isAdmin) {return true;}
    return !!subscription?.isActive;
  }, [isAuthenticated, isSuperAdmin, isAdmin, subscription]);

  const canPerformActions = useMemo(() => {
    return isAuthenticated && (isSuperAdmin || isAdmin || hasActiveSubscription);
  }, [isAuthenticated, isSuperAdmin, isAdmin, hasActiveSubscription]);

  const canOnlyView = isAuthenticated;

  // Route access
  const canAccessRoute = (route: string): boolean => {
    const routePerms = ROUTE_PERMISSIONS[route as keyof typeof ROUTE_PERMISSIONS];
    if (!routePerms) {return true;} // No restrictions

    const perms = Array.isArray(routePerms) ? routePerms : [routePerms];

    // Separate roles and permissions
    const requiredRoles = perms.filter(isKnownRole);
    const requiredPerms = perms.filter(isKnownPermission);

    if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {return false;}
    if (requiredPerms.length > 0 && !hasAnyPermission(requiredPerms)) {return false;}

    return true;
  };

  // Flexible access control
  const canAccess = (
    requiredRoles?: string[],
    requiredPermissions?: string[]
  ): boolean => {
    if (isAnonymous) {return true;} // Let route-level logic handle public routes

    if (isSuperAdmin) {return true;}

    if (isAdmin) {
      // Block access to super admin-only routes
      if (requiredRoles?.includes(ROLES.SUPER_ADMIN)) {return false;}
      return true;
    }

    if (requiredRoles?.length && !hasAnyRole(requiredRoles)) {return false;}
    if (requiredPermissions?.length && !hasAnyPermission(requiredPermissions))
      {return false;}

    return true;
  };

  // Resource-specific checks
  const canCheckout = isAuthenticated;

  const canManage = (resource: string): boolean => {
    const manageMap: Record<string, string[]> = {
      users: [
        PERMISSIONS.READ_USERS,
        PERMISSIONS.CREATE_USERS,
        PERMISSIONS.UPDATE_USERS,
        PERMISSIONS.DELETE_USERS,
      ],
      roles: [
        PERMISSIONS.READ_ROLES,
        PERMISSIONS.CREATE_ROLES,
        PERMISSIONS.UPDATE_ROLES,
        PERMISSIONS.DELETE_ROLES,
      ],
      permissions: [
        PERMISSIONS.READ_PERMISSIONS,
        PERMISSIONS.CREATE_PERMISSIONS,
        PERMISSIONS.UPDATE_PERMISSIONS,
        PERMISSIONS.DELETE_PERMISSIONS,
      ],
      products: [
        PERMISSIONS.READ_PRODUCTS,
        PERMISSIONS.CREATE_PRODUCTS,
        PERMISSIONS.UPDATE_PRODUCTS,
        PERMISSIONS.DELETE_PRODUCTS,
      ],
      orders: [
        PERMISSIONS.READ_ORDERS,
        PERMISSIONS.CREATE_ORDERS,
        PERMISSIONS.UPDATE_ORDERS,
        PERMISSIONS.DELETE_ORDERS,
      ],
      categories: [
        PERMISSIONS.READ_CATEGORIES,
        PERMISSIONS.CREATE_CATEGORIES,
        PERMISSIONS.UPDATE_CATEGORIES,
        PERMISSIONS.DELETE_CATEGORIES,
      ],
      stores: [
        PERMISSIONS.READ_STORES,
        PERMISSIONS.CREATE_STORES,
        PERMISSIONS.UPDATE_STORES,
        PERMISSIONS.DELETE_STORES,
      ],
    };

    const perms = manageMap[resource];
    return perms ? hasAnyPermission(perms) : false;
  };

  const canView = (resource: string): boolean => {
    const viewMap: Record<string, string> = {
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

    const perm = viewMap[resource];
    return perm ? hasPermission(perm) : false;
  };

  // Public API
  return {
    // Role checks
    isSuperAdmin,
    isAdmin,
    isVendor,
    isCustomer,
    isAnonymous,

    // Permission checks
    hasRole,
    hasPermission,
    hasAnyRole,
    hasAnyPermission,
    hasAllRoles,
    hasAllPermissions,

    // Business logic
    canShopAnonymously: () => true, // Consider removing if unused
    canCheckout,
    canAccess,
    canAccessRoute,
    canManage,
    canView,
    hasActiveSubscription,
    canPerformActions,
    canOnlyView,

    // User data
    user,
    userId,
    userEmail,
    userName,
    userRoles,
    userPermissions,
    isAuthenticated,
    isAuthenticating,
  };
};