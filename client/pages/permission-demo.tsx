import React from 'react';
import { NextPage } from 'next';
import PermissionExample from '@/components/examples/PermissionExample';
import ProtectedRoute from '@/components/protectedRoute';
import { PageLayout } from '@/components/UI/PageComponents';

const PermissionDemoPage: NextPage = () => {
  return (
    <ProtectedRoute fallback={<div>Please sign in to view this demo</div>}>
      <PageLayout title="Permission Demo" subtitle="Test the permission system components" protected={true}>
        <PermissionExample />
      </PageLayout>
    </ProtectedRoute>
  );
};

export default PermissionDemoPage;