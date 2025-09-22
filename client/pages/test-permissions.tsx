import React from 'react';
import { NextPage } from 'next';
import ProtectedRoute from '@/components/protectedRoute';
import PermissionGate from '@/components/PermissionGate';
import { PERMISSIONS, ROLES } from '@/constants/permissions';

const TestPermissionsPage: NextPage = () => {
  return (
    <div className="container mt-4">
      <h1>Permission System Test</h1>
      
      <div className="row">
        <div className="col-md-6">
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
        </div>
        
        <div className="col-md-6">
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
        </div>
      </div>
      
      <div className="row mt-4">
        <div className="col-md-6">
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
        </div>
        
        <div className="col-md-6">
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
        </div>
      </div>
    </div>
  );
};

export default TestPermissionsPage;
