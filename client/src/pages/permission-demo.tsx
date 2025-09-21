import React from 'react';
import { NextPage } from 'next';
import PermissionExample from '@/components/examples/PermissionExample';
import ProtectedRoute from '@/components/protectedRoute';

const PermissionDemoPage: NextPage = () => {
  return (
    <ProtectedRoute fallback={<div>Please sign in to view this demo</div>}>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <PermissionExample />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default PermissionDemoPage;
