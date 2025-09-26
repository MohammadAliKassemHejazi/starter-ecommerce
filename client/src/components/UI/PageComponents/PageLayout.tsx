import React from 'react';
import Layout from '@/components/Layouts/Layout';
import ProtectedRoute from '@/components/protectedRoute';
import { PageHeader } from './PageHeader';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
  actions?: React.ReactNode;
  protected?: boolean;
  className?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  subtitle,
  breadcrumbs,
  actions,
  protected: isProtected = true,
  className = ''
}) => {
  const content = (
    <Layout>
      <div className={`container mt-5 ${className}`}>
        <PageHeader
          title={title}
          subtitle={subtitle}
          breadcrumbs={breadcrumbs}
          actions={actions}
        />
        {children}
      </div>
    </Layout>
  );

  return isProtected ? (
    <ProtectedRoute>
      {content}
    </ProtectedRoute>
  ) : content;
};

export default PageLayout;
