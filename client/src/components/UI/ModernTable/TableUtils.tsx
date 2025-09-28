import React from 'react';
import { TableColumn } from './ModernTable';

// Common column renderers
export const renderText = (value: any) => (
  <span className="text-truncate" title={String(value)}>
    {value || '-'}
  </span>
);

export const renderBadge = (value: any, variant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' = 'primary') => (
  <span className={`badge bg-${variant}`}>
    {value || 'N/A'}
  </span>
);

export const renderStatus = (value: boolean | string) => {
  const isActive = typeof value === 'boolean' ? value : value === 'active' || value === 'true';
  return (
    <span className={`badge ${isActive ? 'bg-success' : 'bg-secondary'}`}>
      <i className={`bi bi-${isActive ? 'check-circle' : 'x-circle'} me-1`}></i>
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );
};

export const renderDate = (value: string | Date, format: 'short' | 'long' | 'time' = 'short') => {
  if (!value) return '-';
  
  const date = new Date(value);
  const formatOptions = {
    short: { year: 'numeric', month: 'short', day: 'numeric' } as Intl.DateTimeFormatOptions,
    long: { year: 'numeric', month: 'long', day: 'numeric' } as Intl.DateTimeFormatOptions,
    time: { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' } as Intl.DateTimeFormatOptions
  };
  
  const options = formatOptions[format];
  
  return (
    <span className="text-muted small">
      <i className="bi bi-calendar3 me-1"></i>
      {date.toLocaleDateString('en-US', options)}
    </span>
  );
};

export const renderImage = (src: string, alt: string, size: 'sm' | 'md' | 'lg' = 'sm') => {
  const sizeClasses = {
    sm: 'w-25 h-25',
    md: 'w-50 h-50',
    lg: 'w-75 h-75'
  };
  
  return (
    <div className={`d-flex align-items-center ${sizeClasses[size]}`}>
      <img
        src={src}
        alt={alt}
        className="img-thumbnail rounded"
        style={{ maxWidth: '60px', maxHeight: '60px', objectFit: 'cover' }}
        onError={(e) => {
          e.currentTarget.src = '/placeholder-image.png';
        }}
      />
    </div>
  );
};

export const renderEmail = (email: string) => (
  <a href={`mailto:${email}`} className="text-decoration-none">
    <i className="bi bi-envelope me-1"></i>
    {email}
  </a>
);

export const renderPhone = (phone: string) => (
  <a href={`tel:${phone}`} className="text-decoration-none">
    <i className="bi bi-telephone me-1"></i>
    {phone}
  </a>
);

export const renderPrice = (price: number, currency: string = 'USD') => (
  <span className="fw-semibold text-success">
    {new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price)}
  </span>
);

export const renderCount = (count: number, total?: number) => (
  <div className="d-flex align-items-center">
    <span className="badge bg-primary me-2">{count}</span>
    {total && (
      <span className="text-muted small">
        of {total}
      </span>
    )}
  </div>
);

// Common column configurations
export const createIdColumn = (): TableColumn => ({
  key: 'id',
  label: 'ID',
  width: '80px',
  align: 'center' as const,
  render: (value) => <code className="small">{value}</code>
});

export const createNameColumn = (): TableColumn => ({
  key: 'name',
  label: 'Name',
  sortable: true,
  render: renderText
});

export const createEmailColumn = (): TableColumn => ({
  key: 'email',
  label: 'Email',
  sortable: true,
  render: renderEmail
});

export const createStatusColumn = (): TableColumn => ({
  key: 'isActive',
  label: 'Status',
  width: '100px',
  align: 'center' as const,
  render: renderStatus
});

export const createDateColumn = (key: string, label: string): TableColumn => ({
  key,
  label,
  sortable: true,
  width: '150px',
  render: (value) => renderDate(value, 'short')
});

export const createActionsColumn = (): TableColumn => ({
  key: 'actions',
  label: 'Actions',
  width: '120px',
  align: 'center' as const
});

// Utility functions
export const createColumns = (configs: Partial<TableColumn>[]): TableColumn[] => {
  return configs.map(config => ({
    key: '',
    label: '',
    sortable: true,
    ...config
  }));
};

export const getColumnKeys = (columns: TableColumn[]): string[] => {
  return columns.map(col => col.key);
};

export const findColumn = (columns: TableColumn[], key: string): TableColumn | undefined => {
  return columns.find(col => col.key === key);
};
