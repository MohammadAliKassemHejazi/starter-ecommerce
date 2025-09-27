import React from 'react';
import { NextPage } from 'next';
import { usePermissions } from '@/hooks/usePermissions';
import { PERMISSIONS, ROLES } from '@/constants/permissions';
import { PageLayout } from '@/components/UI/PageComponents';

const NavigationDemoPage: NextPage = () => {
  const {
    isAuthenticated,
    isSuperAdmin,
    isAdmin,
    isVendor,
    isCustomer,
    hasRole,
    hasPermission,
    userRoles,
    userPermissions,
    userName,
    userEmail
  } = usePermissions();


  const UserInfoCard = () => (
    <div className="card mb-4">
      <div className="card-header">
        <h5>Current User Information</h5>
      </div>
      <div className="card-body">
        <p><strong>Name:</strong> {userName || 'Not logged in'}</p>
        <p><strong>Email:</strong> {userEmail || 'Not logged in'}</p>
        <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
        <p><strong>Roles:</strong> {userRoles.map(role => role.name).join(', ') || 'None'}</p>
        <p><strong>Permissions:</strong> {userPermissions.map(perm => perm.name).join(', ') || 'None'}</p>
      </div>
    </div>
  );

  const NavigationTestCard = () => (
    <div className="card mb-4">
      <div className="card-header">
        <h5>Navigation Test</h5>
      </div>
      <div className="card-body">
        <p>Click the navigation button in the navbar to see the permission-based navigation menu.</p>
        <p>The navigation will show different items based on your current role and permissions.</p>
        
        <div className="mt-3">
          <h6>Expected Navigation Items:</h6>
          <ul>
            <li><strong>All Users:</strong> Home, About, Shop, Cart</li>
            {isAuthenticated && (
              <>
                <li><strong>Customers:</strong> Favorites, My Orders, Order History</li>
                {isAdmin() && (
                  <li><strong>Admins:</strong> Dashboard, User Management, Content Management, Business Management, System Management</li>
                )}
                {isSuperAdmin() && (
                  <li><strong>Super Admins:</strong> All admin items plus Platform Management, Tenant Management, Monitoring</li>
                )}
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );

  const PermissionStatusCard = () => (
    <div className="card mb-4">
      <div className="card-header">
        <h5>Permission Status</h5>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-6">
            <h6>Role Checks</h6>
            <ul className="list-group">
              <li className="list-group-item d-flex justify-content-between">
                <span>Is Super Admin:</span>
                <span className={isSuperAdmin() ? 'text-success' : 'text-danger'}>
                  {isSuperAdmin() ? 'Yes' : 'No'}
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Is Admin:</span>
                <span className={isAdmin() ? 'text-success' : 'text-danger'}>
                  {isAdmin() ? 'Yes' : 'No'}
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Is Vendor:</span>
                <span className={isVendor() ? 'text-success' : 'text-danger'}>
                  {isVendor() ? 'Yes' : 'No'}
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Is Customer:</span>
                <span className={isCustomer() ? 'text-success' : 'text-danger'}>
                  {isCustomer() ? 'Yes' : 'No'}
                </span>
              </li>
            </ul>
          </div>
          <div className="col-md-6">
            <h6>Permission Checks</h6>
            <ul className="list-group">
              <li className="list-group-item d-flex justify-content-between">
                <span>Can View Users:</span>
                <span className={hasPermission(PERMISSIONS.VIEW_USERS) ? 'text-success' : 'text-danger'}>
                  {hasPermission(PERMISSIONS.VIEW_USERS) ? 'Yes' : 'No'}
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Can View Analytics:</span>
                <span className={hasPermission(PERMISSIONS.VIEW_ANALYTICS) ? 'text-success' : 'text-danger'}>
                  {hasPermission(PERMISSIONS.VIEW_ANALYTICS) ? 'Yes' : 'No'}
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Can View Dashboard:</span>
                <span className={hasPermission(PERMISSIONS.VIEW_DASHBOARD) ? 'text-success' : 'text-danger'}>
                  {hasPermission(PERMISSIONS.VIEW_DASHBOARD) ? 'Yes' : 'No'}
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Can View Products:</span>
                <span className={hasPermission(PERMISSIONS.VIEW_PRODUCTS) ? 'text-success' : 'text-danger'}>
                  {hasPermission(PERMISSIONS.VIEW_PRODUCTS) ? 'Yes' : 'No'}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const InstructionsCard = () => (
    <div className="card">
      <div className="card-header">
        <h5>How to Test</h5>
      </div>
      <div className="card-body">
        <ol>
          <li>Make sure you're logged in with a user that has roles and permissions</li>
          <li>Click the navigation button (hamburger menu) in the navbar</li>
          <li>Observe which navigation items are visible based on your permissions</li>
          <li>Try logging in with different user roles to see different navigation items</li>
          <li>Check the permission status above to see which permissions your user has</li>
        </ol>
        
        <div className="alert alert-info mt-3">
          <strong>Note:</strong> The navigation system automatically filters menu items based on:
          <ul className="mb-0 mt-2">
            <li>User roles (super_admin, admin, vendor, customer)</li>
            <li>User permissions (view_users, view_analytics, etc.)</li>
            <li>Parent-child relationships (if parent has no visible children, its hidden)</li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <PageLayout title="Navigation Permission Demo" subtitle="Test the permission-based navigation system" protected={false}>
      <UserInfoCard />
      <NavigationTestCard />
      <PermissionStatusCard />
      <InstructionsCard />
    </PageLayout>
  );
};

export default NavigationDemoPage;