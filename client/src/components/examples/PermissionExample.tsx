import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { PERMISSIONS, ROLES } from '../../constants/permissions';
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
import ProtectedRoute, { 
  AdminRoute, 
  SuperAdminRoute, 
  VendorRoute, 
  CustomerRoute 
} from '@/components/protectedRoute';

const PermissionExample: React.FC = () => {
  const {
    isAuthenticated,
    isSuperAdmin,
    isAdmin,
    isVendor,
    isCustomer,
    hasRole,
    hasPermission,
    canManage,
    canView,
    userRoles,
    userPermissions,
    userName,
    userEmail
  } = usePermissions();

  return (
    <div className="container mt-4">
      <h2>Permission System Example</h2>
      
      {/* User Information */}
      <div className="card mb-4">
        <div className="card-header">
          <h5>User Information</h5>
        </div>
        <div className="card-body">
          <p><strong>Name:</strong> {userName || 'Not logged in'}</p>
          <p><strong>Email:</strong> {userEmail || 'Not logged in'}</p>
          <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
          <p><strong>Roles:</strong> {userRoles.map(role => role.name).join(', ') || 'None'}</p>
          <p><strong>Permissions:</strong> {userPermissions.map(perm => perm.name).join(', ') || 'None'}</p>
        </div>
      </div>

      {/* Role-based Access Examples */}
      <div className="card mb-4">
        <div className="card-header">
          <h5>Role-based Access Control</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <h6>Super Admin Only</h6>
              <SuperAdminOnly fallback={<p className="text-muted">Super admin access required</p>}>
                <button className="btn btn-danger">Super Admin Action</button>
              </SuperAdminOnly>
            </div>
            <div className="col-md-6">
              <h6>Admin Only</h6>
              <AdminOnly fallback={<p className="text-muted">Admin access required</p>}>
                <button className="btn btn-warning">Admin Action</button>
              </AdminOnly>
            </div>
            <div className="col-md-6">
              <h6>Vendor Only</h6>
              <VendorOnly fallback={<p className="text-muted">Vendor access required</p>}>
                <button className="btn btn-info">Vendor Action</button>
              </VendorOnly>
            </div>
            <div className="col-md-6">
              <h6>Customer Only</h6>
              <CustomerOnly fallback={<p className="text-muted">Customer access required</p>}>
                <button className="btn btn-success">Customer Action</button>
              </CustomerOnly>
            </div>
          </div>
        </div>
      </div>

      {/* Permission-based Access Examples */}
      <div className="card mb-4">
        <div className="card-header">
          <h5>Permission-based Access Control</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <h6>User Management</h6>
              <CanManageUsers fallback={<p className="text-muted">User management permission required</p>}>
                <button className="btn btn-primary">Manage Users</button>
              </CanManageUsers>
            </div>
            <div className="col-md-6">
              <h6>Product Management</h6>
              <CanManageProducts fallback={<p className="text-muted">Product management permission required</p>}>
                <button className="btn btn-primary">Manage Products</button>
              </CanManageProducts>
            </div>
            <div className="col-md-6">
              <h6>Analytics View</h6>
              <CanViewAnalytics fallback={<p className="text-muted">Analytics view permission required</p>}>
                <button className="btn btn-primary">View Analytics</button>
              </CanViewAnalytics>
            </div>
            <div className="col-md-6">
              <h6>Custom Permission Check</h6>
              <PermissionGate 
                permissions={[PERMISSIONS.VIEW_DASHBOARD]} 
                fallback={<p className="text-muted">Dashboard view permission required</p>}
              >
                <button className="btn btn-primary">View Dashboard</button>
              </PermissionGate>
            </div>
          </div>
        </div>
      </div>

      {/* Complex Permission Examples */}
      <div className="card mb-4">
        <div className="card-header">
          <h5>Complex Permission Examples</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <h6>Multiple Roles (Any)</h6>
              <PermissionGate 
                roles={[ROLES.ADMIN, ROLES.VENDOR]} 
                fallback={<p className="text-muted">Admin or Vendor access required</p>}
              >
                <button className="btn btn-secondary">Admin or Vendor Action</button>
              </PermissionGate>
            </div>
            <div className="col-md-6">
              <h6>Multiple Permissions (All Required)</h6>
              <PermissionGate 
                permissions={[PERMISSIONS.READ_USERS, PERMISSIONS.CREATE_USERS]} 
                requireAll={true}
                fallback={<p className="text-muted">Both read and create user permissions required</p>}
              >
                <button className="btn btn-secondary">Create User Action</button>
              </PermissionGate>
            </div>
            <div className="col-md-6">
              <h6>Authentication Required</h6>
              <AuthenticatedOnly fallback={<p className="text-muted">Please sign in to access this feature</p>}>
                <button className="btn btn-secondary">Authenticated User Action</button>
              </AuthenticatedOnly>
            </div>
            <div className="col-md-6">
              <h6>Custom Fallback</h6>
              <PermissionGate 
                roles={[ROLES.SUPER_ADMIN]} 
                fallback={<div className="alert alert-warning">This feature is only available to super administrators</div>}
              >
                <button className="btn btn-secondary">Super Admin Feature</button>
              </PermissionGate>
            </div>
          </div>
        </div>
      </div>

      {/* Hook Usage Examples */}
      <div className="card mb-4">
        <div className="card-header">
          <h5>Hook Usage Examples</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <h6>Direct Permission Checks</h6>
              <ul className="list-group">
                <li className="list-group-item d-flex justify-content-between">
                  <span>Is Super Admin:</span>
                  <span className={isSuperAdmin ? 'text-success' : 'text-danger'}>
                    {isSuperAdmin ? 'Yes' : 'No'}
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span>Is Admin:</span>
                  <span className={isAdmin ? 'text-success' : 'text-danger'}>
                    {isAdmin ? 'Yes' : 'No'}
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span>Is Vendor:</span>
                  <span className={isVendor ? 'text-success' : 'text-danger'}>
                    {isVendor ? 'Yes' : 'No'}
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span>Is Customer:</span>
                  <span className={isCustomer ? 'text-success' : 'text-danger'}>
                    {isCustomer ? 'Yes' : 'No'}
                  </span>
                </li>
              </ul>
            </div>
            <div className="col-md-6">
              <h6>Permission Checks</h6>
              <ul className="list-group">
                <li className="list-group-item d-flex justify-content-between">
                  <span>Can Manage Users:</span>
                  <span className={canManage('users') ? 'text-success' : 'text-danger'}>
                    {canManage('users') ? 'Yes' : 'No'}
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span>Can View Analytics:</span>
                  <span className={canView('analytics') ? 'text-success' : 'text-danger'}>
                    {canView('analytics') ? 'Yes' : 'No'}
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span>Has View Products Permission:</span>
                  <span className={hasPermission(PERMISSIONS.VIEW_PRODUCTS) ? 'text-success' : 'text-danger'}>
                    {hasPermission(PERMISSIONS.VIEW_PRODUCTS) ? 'Yes' : 'No'}
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span>Has Admin Role:</span>
                  <span className={hasRole(ROLES.ADMIN) ? 'text-success' : 'text-danger'}>
                    {hasRole(ROLES.ADMIN) ? 'Yes' : 'No'}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Route Protection Examples */}
      <div className="card mb-4">
        <div className="card-header">
          <h5>Route Protection Examples</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <h6>Admin Route</h6>
              <AdminRoute fallback={<p className="text-muted">This content is only visible to admins</p>}>
                <div className="alert alert-info">This is admin-only content!</div>
              </AdminRoute>
            </div>
            <div className="col-md-6">
              <h6>Vendor Route</h6>
              <VendorRoute fallback={<p className="text-muted">This content is only visible to vendors</p>}>
                <div className="alert alert-info">This is vendor-only content!</div>
              </VendorRoute>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionExample;
