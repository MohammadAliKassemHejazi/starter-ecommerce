import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface RoleBasedAccessProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  requiredPermissions?: string[];
  fallback?: React.ReactNode;
}

const RoleBasedAccess: React.FC<RoleBasedAccessProps> = ({
  children,
  requiredRoles = [],
  requiredPermissions = [],
  fallback = null
}) => {
  const user = useSelector((state: RootState) => state.user.user);
  const userRoles = user?.roles || [];
  const userPermissions = user?.permissions || [];

  // Check if user has required roles
  const hasRequiredRole = requiredRoles.length === 0 || 
    requiredRoles.some(role => userRoles.some(userRole => userRole.name === role));

  // Check if user has required permissions
  const hasRequiredPermission = requiredPermissions.length === 0 || 
    requiredPermissions.some(permission => userPermissions.some(userPermission => userPermission.name === permission));

  // User must have at least one required role AND one required permission
  const hasAccess = hasRequiredRole && hasRequiredPermission;

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default RoleBasedAccess;
