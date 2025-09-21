# Permission System Documentation

This document explains how to use the comprehensive permission system implemented in this application.

## Overview

The permission system provides role-based access control (RBAC) and permission-based access control (PBAC) for the frontend application. It works with the login response structure that includes user roles and permissions.

## Login Response Structure

The system expects a login response with the following structure:

```typescript
{
  "id": "user-id",
  "email": "user@example.com",
  "name": "User Name",
  "address": "User Address",
  "phone": "1234567890",
  "accessToken": "jwt-token",
  "roles": [
    {
      "id": "role-id",
      "name": "role_name"
    }
  ],
  "permissions": [
    {
      "id": "permission-id",
      "name": "permission_name"
    }
  ]
}
```

## Core Components

### 1. Permission Constants (`/constants/permissions.ts`)

Defines all available permissions and roles as constants for type safety and consistency.

```typescript
import { PERMISSIONS, ROLES } from '@/constants/permissions';

// Use permissions
PERMISSIONS.VIEW_USERS
PERMISSIONS.CREATE_PRODUCTS
PERMISSIONS.DELETE_ORDERS

// Use roles
ROLES.SUPER_ADMIN
ROLES.ADMIN
ROLES.VENDOR
ROLES.CUSTOMER
```

### 2. Permission Hook (`/hooks/usePermissions.ts`)

The main hook for checking permissions and roles throughout the application.

```typescript
import { usePermissions } from '@/hooks/usePermissions';

const MyComponent = () => {
  const {
    isAuthenticated,
    isSuperAdmin,
    isAdmin,
    isVendor,
    isCustomer,
    hasRole,
    hasPermission,
    hasAnyRole,
    hasAnyPermission,
    hasAllRoles,
    hasAllPermissions,
    canManage,
    canView,
    canAccessRoute,
    userRoles,
    userPermissions,
    userName,
    userEmail
  } = usePermissions();

  // Check specific role
  if (hasRole(ROLES.ADMIN)) {
    // Admin-only logic
  }

  // Check specific permission
  if (hasPermission(PERMISSIONS.VIEW_USERS)) {
    // User can view users
  }

  // Check multiple roles (any)
  if (hasAnyRole([ROLES.ADMIN, ROLES.VENDOR])) {
    // Admin or vendor logic
  }

  // Check multiple permissions (all required)
  if (hasAllPermissions([PERMISSIONS.READ_USERS, PERMISSIONS.CREATE_USERS])) {
    // User can both read and create users
  }

  // Check if user can manage a resource
  if (canManage('users')) {
    // User can manage users
  }

  // Check if user can view a resource
  if (canView('analytics')) {
    // User can view analytics
  }
};
```

### 3. Permission Gate Component (`/components/PermissionGate.tsx`)

A component for conditional rendering based on permissions and roles.

```typescript
import PermissionGate, { 
  AdminOnly, 
  SuperAdminOnly, 
  VendorOnly, 
  CustomerOnly, 
  AuthenticatedOnly,
  CanManageUsers,
  CanManageProducts,
  CanViewAnalytics
} from '@/components/PermissionGate';

// Basic usage
<PermissionGate 
  roles={[ROLES.ADMIN]} 
  permissions={[PERMISSIONS.VIEW_USERS]}
  fallback={<div>Access Denied</div>}
>
  <AdminContent />
</PermissionGate>

// Convenience components
<AdminOnly fallback={<div>Admin access required</div>}>
  <AdminContent />
</AdminOnly>

<CanManageUsers fallback={<div>User management permission required</div>}>
  <UserManagementContent />
</CanManageUsers>

// Multiple roles (any)
<PermissionGate 
  roles={[ROLES.ADMIN, ROLES.VENDOR]} 
  fallback={<div>Admin or Vendor access required</div>}
>
  <AdminOrVendorContent />
</PermissionGate>

// Multiple permissions (all required)
<PermissionGate 
  permissions={[PERMISSIONS.READ_USERS, PERMISSIONS.CREATE_USERS]} 
  requireAll={true}
  fallback={<div>Both read and create user permissions required</div>}
>
  <UserCreationContent />
</PermissionGate>

// Authentication required
<AuthenticatedOnly fallback={<div>Please sign in</div>}>
  <AuthenticatedContent />
</AuthenticatedOnly>
```

### 4. Protected Route Component (`/components/ProtectedRoute.tsx`)

A component for protecting entire routes based on permissions and roles.

```typescript
import ProtectedRoute, { 
  AdminRoute, 
  SuperAdminRoute, 
  VendorRoute, 
  CustomerRoute,
  AuthenticatedRoute
} from '@/components/ProtectedRoute';

// Basic usage
<ProtectedRoute 
  requiredRoles={[ROLES.ADMIN]} 
  requiredPermissions={[PERMISSIONS.VIEW_USERS]}
  fallback={<div>Access Denied</div>}
  redirectTo="/auth/signin"
>
  <AdminPage />
</ProtectedRoute>

// Convenience components
<AdminRoute fallback={<div>Admin access required</div>}>
  <AdminPage />
</AdminRoute>

<SuperAdminRoute fallback={<div>Super admin access required</div>}>
  <SuperAdminPage />
</SuperAdminRoute>

<VendorRoute fallback={<div>Vendor access required</div>}>
  <VendorPage />
</VendorRoute>

<CustomerRoute fallback={<div>Customer access required</div>}>
  <CustomerPage />
</CustomerRoute>

<AuthenticatedRoute fallback={<div>Please sign in to access this page</div>}>
  <AuthenticatedPage />
</AuthenticatedRoute>
```

### 5. Permission Utilities (`/utils/permissionUtils.ts`)

Utility functions for working with permissions and roles.

```typescript
import { 
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
  getRequiredPermission
} from '@/utils/permissionUtils';

// Check permission types
if (isUserManagementPermission('read_users')) {
  // This is a user management permission
}

if (isReadOnlyPermission('view_products')) {
  // This is a read-only permission
}

// Get permission information
const category = getPermissionCategory('read_users'); // 'users'
const action = getPermissionAction('create_products'); // 'create'

// Check role types
if (isAdminRole('admin')) {
  // This is an admin role
}

// Compare role privileges
if (hasHigherPrivileges('admin', 'vendor')) {
  // Admin has higher privileges than vendor
}

// Get required permission for an action
const requiredPermission = getRequiredPermission('create', 'users');
// Returns 'create_users' or null
```

## Usage Examples

### 1. Navigation Menu with Permissions

```typescript
import { usePermissions } from '@/hooks/usePermissions';
import { PERMISSIONS, ROLES } from '@/constants/permissions';

const Navigation = () => {
  const { hasPermission, hasRole, canView } = usePermissions();

  return (
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/shop">Shop</a></li>
        
        {hasPermission(PERMISSIONS.VIEW_USERS) && (
          <li><a href="/admin/users">Users</a></li>
        )}
        
        {hasRole(ROLES.ADMIN) && (
          <li><a href="/admin">Admin Panel</a></li>
        )}
        
        {canView('analytics') && (
          <li><a href="/admin/analytics">Analytics</a></li>
        )}
      </ul>
    </nav>
  );
};
```

### 2. Button with Permission Check

```typescript
import PermissionGate from '@/components/PermissionGate';
import { PERMISSIONS } from '@/constants/permissions';

const UserActions = () => {
  return (
    <div>
      <PermissionGate 
        permissions={[PERMISSIONS.CREATE_USERS]}
        fallback={<button disabled>Create User (No Permission)</button>}
      >
        <button onClick={createUser}>Create User</button>
      </PermissionGate>
      
      <PermissionGate 
        permissions={[PERMISSIONS.DELETE_USERS]}
        fallback={<button disabled>Delete User (No Permission)</button>}
      >
        <button onClick={deleteUser}>Delete User</button>
      </PermissionGate>
    </div>
  );
};
```

### 3. Page with Route Protection

```typescript
import AdminRoute from '@/components/ProtectedRoute';
import { PERMISSIONS } from '@/constants/permissions';

const AdminUsersPage = () => {
  return (
    <AdminRoute fallback={<div>Admin access required</div>}>
      <div>
        <h1>User Management</h1>
        <PermissionGate permissions={[PERMISSIONS.VIEW_USERS]}>
          <UserList />
        </PermissionGate>
        <PermissionGate permissions={[PERMISSIONS.CREATE_USERS]}>
          <CreateUserForm />
        </PermissionGate>
      </div>
    </AdminRoute>
  );
};
```

### 4. Conditional Rendering with Multiple Conditions

```typescript
import { usePermissions } from '@/hooks/usePermissions';
import { PERMISSIONS, ROLES } from '@/constants/permissions';

const Dashboard = () => {
  const { 
    hasAnyRole, 
    hasAllPermissions, 
    canManage, 
    isSuperAdmin 
  } = usePermissions();

  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Show for admins or vendors */}
      {hasAnyRole([ROLES.ADMIN, ROLES.VENDOR]) && (
        <div>Admin/Vendor Content</div>
      )}
      
      {/* Show only if user has both read and create permissions */}
      {hasAllPermissions([PERMISSIONS.READ_USERS, PERMISSIONS.CREATE_USERS]) && (
        <div>Full User Management Access</div>
      )}
      
      {/* Show if user can manage products */}
      {canManage('products') && (
        <div>Product Management</div>
      )}
      
      {/* Super admin only content */}
      {isSuperAdmin() && (
        <div>Super Admin Only Content</div>
      )}
    </div>
  );
};
```

## Best Practices

### 1. Use Constants
Always use the permission and role constants instead of hardcoded strings:

```typescript
// Good
hasPermission(PERMISSIONS.VIEW_USERS)

// Bad
hasPermission('view_users')
```

### 2. Provide Fallbacks
Always provide meaningful fallback content for users without permissions:

```typescript
<PermissionGate 
  permissions={[PERMISSIONS.VIEW_USERS]}
  fallback={<div>You don't have permission to view users</div>}
>
  <UserList />
</PermissionGate>
```

### 3. Use Appropriate Components
Choose the right component for your use case:

- Use `PermissionGate` for conditional rendering within components
- Use `ProtectedRoute` for protecting entire pages/routes
- Use the hook directly for complex logic

### 4. Check Permissions Early
Check permissions as early as possible in your component tree to avoid unnecessary rendering:

```typescript
const MyComponent = () => {
  const { hasPermission } = usePermissions();
  
  // Early return if no permission
  if (!hasPermission(PERMISSIONS.VIEW_USERS)) {
    return <div>Access Denied</div>;
  }
  
  // Rest of component logic
  return <UserList />;
};
```

### 5. Use Utility Functions
Use the utility functions for complex permission logic:

```typescript
import { getRequiredPermission, isWritePermission } from '@/utils/permissionUtils';

const handleAction = (action: string, resource: string) => {
  const requiredPermission = getRequiredPermission(action, resource);
  
  if (requiredPermission && !hasPermission(requiredPermission)) {
    showError('You don\'t have permission to perform this action');
    return;
  }
  
  // Perform action
};
```

## Testing

The permission system can be tested by:

1. Mocking the user state in Redux
2. Testing different role and permission combinations
3. Verifying that components render correctly based on permissions
4. Testing route protection

```typescript
// Example test
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import PermissionGate from '@/components/PermissionGate';

const mockStore = {
  ...store,
  user: {
    isAuthenticated: true,
    roles: [{ id: '1', name: 'admin' }],
    permissions: [{ id: '1', name: 'view_users' }]
  }
};

test('renders content for admin with permission', () => {
  render(
    <Provider store={mockStore}>
      <PermissionGate permissions={['view_users']}>
        <div>Admin Content</div>
      </PermissionGate>
    </Provider>
  );
  
  expect(screen.getByText('Admin Content')).toBeInTheDocument();
});
```

## Troubleshooting

### Common Issues

1. **Permission not working**: Check that the permission name matches exactly with the constants
2. **Role not working**: Ensure the role name matches the constants
3. **Fallback not showing**: Make sure the fallback prop is provided
4. **Route not protecting**: Verify that the route is wrapped with the correct protection component

### Debug Tips

1. Use the `usePermissions` hook to log current user state
2. Check the Redux store to verify user data
3. Use browser dev tools to inspect component rendering
4. Add console logs to permission checks for debugging

This permission system provides a robust, type-safe, and easy-to-use solution for managing access control in your React application.
