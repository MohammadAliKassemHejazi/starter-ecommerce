import React from 'react';
import { NextPage } from 'next';
import ProtectedRoute from '@/components/protectedRoute';
import PermissionGate from '@/components/PermissionGate';
import { PERMISSIONS, ROLES } from '@/constants/permissions';
import { PageLayout } from '@/components/UI/PageComponents';

const TestPermissionsPage: NextPage = () => {
  const ProtectedRouteTest = () => (
    <div className="card">
      <div className="card-header">
        <h5>Protected Route Test</h5>
      </div>
      <div className="card-body">
        <ProtectedRoute fallback={<div className="alert alert-warning">Access Denied</div>}>
          <div className="alert alert-success">You have access to this protected content!</div>
        </ProtectedRoute>
      </div>
    </div>
  );

  const PermissionGateTest = () => (
    <div className="card">
      <div className="card-header">
        <h5>Permission Gate Test</h5>
      </div>
      <div className="card-body">
        <PermissionGate 
          permissions={[PERMISSIONS.VIEW_USERS]} 
          fallback={<div className="alert alert-warning">You need view_users permission</div>}
        >
          <div className="alert alert-success">You have view_users permission!</div>
        </PermissionGate>
      </div>
    </div>
  );

  const RoleBasedTest = () => (
    <div className="card">
      <div className="card-header">
        <h5>Role-based Test</h5>
      </div>
      <div className="card-body">
        <PermissionGate 
          roles={[ROLES.ADMIN]} 
          fallback={<div className="alert alert-warning">Admin role required</div>}
        >
          <div className="alert alert-success">You are an admin!</div>
        </PermissionGate>
      </div>
    </div>
  );

  const MultiplePermissionsTest = () => (
    <div className="card">
      <div className="card-header">
        <h5>Multiple Permissions Test</h5>
      </div>
      <div className="card-body">
        <PermissionGate 
          permissions={[PERMISSIONS.VIEW_USERS, PERMISSIONS.CREATE_USERS]} 
          requireAll={true}
          fallback={<div className="alert alert-warning">You need both view_users and create_users permissions</div>}
        >
          <div className="alert alert-success">You have both permissions!</div>
        </PermissionGate>
      </div>
    </div>
  );

  return (
    <PageLayout title="Permission System Test" subtitle="Test the permission and role-based access control system" protected={false}>
      <div className="row">
        <div className="col-md-6 mb-4">
          <ProtectedRouteTest />
        </div>
        
        <div className="col-md-6 mb-4">
          <PermissionGateTest />
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-6 mb-4">
          <RoleBasedTest />
        </div>
        
        <div className="col-md-6 mb-4">
          <MultiplePermissionsTest />
        </div>
      </div>
    </PageLayout>
  );
};

export default TestPermissionsPage;