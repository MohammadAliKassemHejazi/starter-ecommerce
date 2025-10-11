import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { usePermissions } from '@/hooks/usePermissions';
import {  ROLES } from '../constants/permissions';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  requiredPermissions?: string[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

// Client-side only component that uses hooks
const ClientProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
  requiredPermissions = [],
  fallback = <div>Access Denied</div>,
  redirectTo = '/auth/signin',
}) => {
 
  const router = useRouter();
  const { isAuthenticated, canAccessRoute, canAccess } = usePermissions();

  // Check if user can access the current route
  const canAccessCurrentRoute = canAccessRoute(router.asPath);

  // Check custom requirements
  const canAccessWithRequirements = canAccess(requiredRoles, requiredPermissions);

  // If user can't access the route, redirect or show fallback
  if (!canAccessCurrentRoute || !canAccessWithRequirements) {

    // TODO : Handle redirect loop
    if (redirectTo && !isAuthenticated) {
      router.push(redirectTo);
      return null;
    }
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// Main component that handles client-side rendering
const ProtectedRoute: React.FC<ProtectedRouteProps> = (props) => {
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
  return <ClientProtectedRoute {...props} />;
};

// Convenience components for common route protection patterns
export const AdminRoute: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
  children,
  fallback = <div>Admin access required</div>,
}) => (
  <ProtectedRoute requiredRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]} fallback={fallback}>
    {children}
  </ProtectedRoute>
);

export const SuperAdminRoute: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
  children,
  fallback = <div>Super admin access required</div>,
}) => (
  <ProtectedRoute requiredRoles={[ROLES.SUPER_ADMIN]} fallback={fallback}>
    {children}
  </ProtectedRoute>
);

export const VendorRoute: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
  children,
  fallback = <div>Vendor access required</div>,
}) => (
  <ProtectedRoute requiredRoles={[ROLES.VENDOR, ROLES.STORE_OWNER]} fallback={fallback}>
    {children}
  </ProtectedRoute>
);

export const CustomerRoute: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
  children,
  fallback = <div>Customer access required</div>,
}) => (
  <ProtectedRoute requiredRoles={[ROLES.CUSTOMER, ROLES.USER]} fallback={fallback}>
    {children}
  </ProtectedRoute>
);

export const AuthenticatedRoute: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
  children,
  fallback = <div>Please sign in to access this page</div>,
}) => (
  <ProtectedRoute requiredRoles={[]} requiredPermissions={[]} fallback={fallback}>
    {children}
  </ProtectedRoute>
);

export default ProtectedRoute;