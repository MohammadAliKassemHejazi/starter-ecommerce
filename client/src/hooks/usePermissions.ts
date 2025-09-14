import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export const usePermissions = () => {
  const user = useSelector((state: RootState) => state.user);
  const userRoles = user?.roles || [];
  const userPermissions = user?.permissions || [];

  const hasRole = (roleName: string): boolean => {
    // Admin has access to everything
    if (isAdmin()) { return true };
    return userRoles.some(role => role.name === roleName);
  };

  const hasPermission = (permissionName: string): boolean => {
    // Admin has access to everything
    if (isAdmin()) { return true };
    return userPermissions.some(permission => permission.name === permissionName);
  };

  const hasAnyRole = (roleNames: string[]): boolean => {
    // Admin has access to everything
    if (isAdmin()) { return true };
    return roleNames.some(roleName => hasRole(roleName));
  };

  const hasAnyPermission = (permissionNames: string[]): boolean => {
    // Admin has access to everything
    if (isAdmin()) { return true };
    return permissionNames.some(permissionName => hasPermission(permissionName));
  };

  const hasAllRoles = (roleNames: string[]): boolean => {
    // Admin has access to everything
    if (isAdmin()) { return true };
    return roleNames.every(roleName => hasRole(roleName));
  };

  const hasAllPermissions = (permissionNames: string[]): boolean => {
    // Admin has access to everything
    if (isAdmin()) { return true };
    return permissionNames.every(permissionName => hasPermission(permissionName));
  };

  const isAdmin = (): boolean => {
    return userRoles.some(role => role.name === 'admin' || role.name === 'super_admin');
  };

  const isVendor = (): boolean => {
    return userRoles.some(role => role.name === 'vendor' || role.name === 'store_owner');
  };

  const isCustomer = (): boolean => {
    return userRoles.some(role => role.name === 'customer' || role.name === 'user');
  };

  // Admin bypass for all route access
  const canAccess = (requiredRoles?: string[], requiredPermissions?: string[]): boolean => {
    if (isAdmin()) { return true };
    
    if (requiredRoles && requiredRoles.length > 0) {
      return hasAnyRole(requiredRoles);
    }
    
    if (requiredPermissions && requiredPermissions.length > 0) {
      return hasAnyPermission(requiredPermissions);
    }
    
    return true; // No specific requirements
  };

  return {
    hasRole,
    hasPermission,
    hasAnyRole,
    hasAnyPermission,
    hasAllRoles,
    hasAllPermissions,
    isAdmin,
    isVendor,
    isCustomer,
    canAccess,
    userRoles,
    userPermissions
  };
};
