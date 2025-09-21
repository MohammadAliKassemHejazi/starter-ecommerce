import React, { useEffect, useState } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { PERMISSIONS, ROLES } from '../constants/permissions';

interface PermissionGateProps {
  children: React.ReactNode;
  roles?: string[];
  permissions?: string[];
  requireAll?: boolean; // If true, user must have ALL roles/permissions. If false, user needs ANY of them
  fallback?: React.ReactNode;
  requireAuthentication?: boolean;
}

// Client-side only component that uses hooks
const ClientPermissionGate: React.FC<PermissionGateProps> = ({
  children,
  roles = [],
  permissions = [],
  requireAll = false,
  fallback = null,
  requireAuthentication = false,
}) => {
  const {
    isAuthenticated,
    hasRole,
    hasPermission,
    hasAnyRole,
    hasAnyPermission,
    hasAllRoles,
    hasAllPermissions,
  } = usePermissions();

  // Check authentication requirement
  if (requireAuthentication && !isAuthenticated) {
    return <>{fallback}</>;
  }

  // If no specific requirements, show content
  if (roles.length === 0 && permissions.length === 0) {
    return <>{children}</>;
  }

  let hasAccess = false;

  if (requireAll) {
    // User must have ALL specified roles AND permissions
    const hasAllRequiredRoles = roles.length === 0 || hasAllRoles(roles);
    const hasAllRequiredPermissions = permissions.length === 0 || hasAllPermissions(permissions);
    hasAccess = hasAllRequiredRoles && hasAllRequiredPermissions;
  } else {
    // User needs ANY of the specified roles OR permissions
    const hasAnyRequiredRole = roles.length === 0 || hasAnyRole(roles);
    const hasAnyRequiredPermission = permissions.length === 0 || hasAnyPermission(permissions);
    hasAccess = hasAnyRequiredRole || hasAnyRequiredPermission;
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

// Main component that handles client-side rendering
const PermissionGate: React.FC<PermissionGateProps> = (props) => {
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render anything on server side
  if (!isClient) {
    return null;
  }

  // Render the client-side component
  return <ClientPermissionGate {...props} />;
};

// Convenience components for common use cases
export const AdminOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
  children,
  fallback = null,
}) => (
  <PermissionGate roles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]} fallback={fallback}>
    {children}
  </PermissionGate>
);

export const SuperAdminOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
  children,
  fallback = null,
}) => (
  <PermissionGate roles={[ROLES.SUPER_ADMIN]} fallback={fallback}>
    {children}
  </PermissionGate>
);

export const VendorOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
  children,
  fallback = null,
}) => (
  <PermissionGate roles={[ROLES.VENDOR, ROLES.STORE_OWNER]} fallback={fallback}>
    {children}
  </PermissionGate>
);

export const CustomerOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
  children,
  fallback = null,
}) => (
  <PermissionGate roles={[ROLES.CUSTOMER, ROLES.USER]} fallback={fallback}>
    {children}
  </PermissionGate>
);

export const AuthenticatedOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
  children,
  fallback = null,
}) => (
  <PermissionGate requireAuthentication={true} fallback={fallback}>
    {children}
  </PermissionGate>
);

// Permission-based components
export const CanManageUsers: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
  children,
  fallback = null,
}) => (
  <PermissionGate permissions={[PERMISSIONS.READ_USERS, PERMISSIONS.CREATE_USERS, PERMISSIONS.UPDATE_USERS, PERMISSIONS.DELETE_USERS]} fallback={fallback}>
    {children}
  </PermissionGate>
);

export const CanManageProducts: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
  children,
  fallback = null,
}) => (
  <PermissionGate permissions={[PERMISSIONS.READ_PRODUCTS, PERMISSIONS.CREATE_PRODUCTS, PERMISSIONS.UPDATE_PRODUCTS, PERMISSIONS.DELETE_PRODUCTS]} fallback={fallback}>
    {children}
  </PermissionGate>
);

export const CanManageOrders: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
  children,
  fallback = null,
}) => (
  <PermissionGate permissions={[PERMISSIONS.READ_ORDERS, PERMISSIONS.CREATE_ORDERS, PERMISSIONS.UPDATE_ORDERS, PERMISSIONS.DELETE_ORDERS]} fallback={fallback}>
    {children}
  </PermissionGate>
);

export const CanViewAnalytics: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
  children,
  fallback = null,
}) => (
  <PermissionGate permissions={[PERMISSIONS.VIEW_ANALYTICS]} fallback={fallback}>
    {children}
  </PermissionGate>
);

export const CanViewDashboard: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
  children,
  fallback = null,
}) => (
  <PermissionGate permissions={[PERMISSIONS.VIEW_DASHBOARD]} fallback={fallback}>
    {children}
  </PermissionGate>
);

export default PermissionGate;
