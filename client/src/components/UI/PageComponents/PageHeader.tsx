import React from 'react';
import { useRouter } from 'next/router';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  actions,
  className = ''
}) => {
  const router = useRouter();

  return (
    <div className={`page-header mb-4 ${className}`}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb">
            {breadcrumbs.map((crumb, index) => (
              <li 
                key={index}
                className={`breadcrumb-item ${index === breadcrumbs.length - 1 ? 'active' : ''}`}
              >
                {crumb.href ? (
                  <a 
                    href={crumb.href}
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(crumb.href!);
                    }}
                    className="text-decoration-none"
                  >
                    {crumb.label}
                  </a>
                ) : (
                  crumb.label
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Title and Actions */}
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <h1 className="h2 fw-bold text-dark mb-1">{title}</h1>
          {subtitle && (
            <p className="text-muted mb-0">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="page-actions">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
