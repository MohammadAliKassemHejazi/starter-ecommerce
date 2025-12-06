import React from 'react';
import { ModernTable, TableColumn, TableAction } from './ModernTable';
import { 
  createIdColumn, 
  createNameColumn, 
  createEmailColumn, 
  createStatusColumn, 
  createDateColumn,
  renderBadge,
  renderImage,
  renderPrice,
  renderCount
} from './TableUtils';

// User Table Preset
export const UserTablePreset = {
  columns: [
    createIdColumn(),
    {
      key: 'avatar',
      label: 'Avatar',
      width: '80px',
      align: 'center' as const,
      render: (value: any, row: any) => renderImage(
        value || '/default-avatar.png', 
        row.name || 'User', 
        'sm'
      )
    },
    createNameColumn(),
    createEmailColumn(),
    {
      key: 'role',
      label: 'Role',
      width: '120px',
      align: 'center' as const,
      render: (value: any) => renderBadge(value?.name || 'No Role', 'info')
    },
    createStatusColumn(),
    createDateColumn('createdAt', 'Created')
  ],
  
  actions: [
    {
      key: 'edit',
      label: 'Edit',
      icon: 'bi bi-pencil',
      variant: 'primary' as const,
      onClick: (row: any) => console.log('Edit user', row)
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: 'bi bi-trash',
      variant: 'danger' as const,
      onClick: (row: any) => console.log('Delete user', row)
    }
  ]
};

// Store Table Preset
export const StoreTablePreset = {
  columns: [
    createIdColumn(),
    {
      key: 'imgUrl',
      label: 'Image',
      width: '100px',
      align: 'center' as const,
      render: (value: any, row: any) => renderImage(
        value || '/default-store.png', 
        row.name || 'Store', 
        'sm'
      )
    },
    createNameColumn(),
    {
      key: 'description',
      label: 'Description',
      render: (value: any) => (
        <span className="text-truncate" title={value} style={{ maxWidth: '200px' }}>
          {value || '-'}
        </span>
      )
    },
    {
      key: 'categoryId',
      label: 'Category',
      width: '120px',
      align: 'center' as const,
      render: (value: any) => renderBadge(value, 'secondary')
    },
    createStatusColumn(),
    createDateColumn('createdAt', 'Created')
  ],
  
  actions: [
    {
      key: 'view',
      label: 'View',
      icon: 'bi bi-eye',
      variant: 'info' as const,
      onClick: (row: any) => console.log('View store', row)
    },
    {
      key: 'edit',
      label: 'Edit',
      icon: 'bi bi-pencil',
      variant: 'primary' as const,
      onClick: (row: any) => console.log('Edit store', row)
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: 'bi bi-trash',
      variant: 'danger' as const,
      onClick: (row: any) => console.log('Delete store', row)
    }
  ]
};

// Product Table Preset
export const ProductTablePreset = {
  columns: [
    createIdColumn(),
    {
      key: 'ProductImages',
      label: 'Image',
      width: '100px',
      align: 'center' as const,
      render: (_value: any, row: any) => {
    
        console.log({row}, "row in product table")
    const imageUrl = row.ProductImages?.[0]?.url || '/default-product.png';
    return renderImage(imageUrl, row.name || 'Product', 'sm');
  }
    },
    createNameColumn(),
    {
      key: 'price',
      label: 'Price',
      width: '120px',
      align: 'right' as const,
      render: (value: any) => renderPrice(value)
    },
    {
      key: 'stockQuantity',
      label: 'Stock',
      width: '100px',
      align: 'center' as const,
      render: (value: any) => renderCount(value)
    },
    {
      key: 'discount',
      label: 'Discount',
      width: '100px',
      align: 'center' as const,
      render: (value: any) => value > 0 ? (
        <span className="badge bg-danger">{value}%</span>
      ) : (
        <span className="text-muted">-</span>
      )
    },
    createStatusColumn(),
    createDateColumn('createdAt', 'Created')
  ],
  
  actions: [
    {
      key: 'view',
      label: 'View',
      icon: 'bi bi-eye',
      variant: 'info' as const,
      onClick: (row: any) => console.log('View product', row)
    },
    {
      key: 'edit',
      label: 'Edit',
      icon: 'bi bi-pencil',
      variant: 'primary' as const,
      onClick: (row: any) => console.log('Edit product', row)
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: 'bi bi-trash',
      variant: 'danger' as const,
      onClick: (row: any) => console.log('Delete product', row)
    }
  ]
};

// Category Table Preset
export const CategoryTablePreset = {
  columns: [
    createIdColumn(),
    createNameColumn(),
    {
      key: 'description',
      label: 'Description',
      render: (value: any) => (
        <span className="text-truncate" title={value} style={{ maxWidth: '300px' }}>                                                                    
          {value || '-'}
        </span>
      )
    },
    createStatusColumn(),
    createDateColumn('createdAt', 'Created')
  ],
  
  actions: [
    {
      key: 'edit',
      label: 'Edit',
      icon: 'bi bi-pencil',
      variant: 'primary' as const,
      onClick: (row: any) => console.log('Edit category', row)
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: 'bi bi-trash',
      variant: 'danger' as const,
      onClick: (row: any) => console.log('Delete category', row)
    }
  ]
};

// Order Table Preset
export const OrderTablePreset = {
  columns: [
    createIdColumn(),
    {
      key: 'orderNumber',
      label: 'Order #',
      width: '120px',
      render: (value: any) => <code>{value}</code>
    },
    {
      key: 'customerName',
      label: 'Customer',
      render: (value: any) => value || 'Guest'
    },
    {
      key: 'totalAmount',
      label: 'Total',
      width: '120px',
      align: 'right' as const,
      render: (value: any) => renderPrice(value)
    },
    {
      key: 'status',
      label: 'Status',
      width: '120px',
      align: 'center' as const,
      render: (value: any) => {
        const statusColors = {
          pending: 'warning',
          processing: 'info',
          shipped: 'primary',
          delivered: 'success',
          cancelled: 'danger'
        };
        return renderBadge(value, (statusColors[value as keyof typeof statusColors] || 'secondary') as any);
      }
    },
    createDateColumn('createdAt', 'Order Date')
  ],
  
  actions: [
    {
      key: 'view',
      label: 'View',
      icon: 'bi bi-eye',
      variant: 'info' as const,
      onClick: (row: any) => console.log('View order', row)
    },
    {
      key: 'edit',
      label: 'Edit',
      icon: 'bi bi-pencil',
      variant: 'primary' as const,
      onClick: (row: any) => console.log('Edit order', row)
    }
  ]
};

// Package Table Preset
export const PackageTablePreset = {
  columns: [
    createIdColumn(),
    createNameColumn(),
    {
      key: 'description',
      label: 'Description',
      render: (value: any) => (
        <span className="text-truncate" title={value} style={{ maxWidth: '250px' }}>                                                                    
          {value || '-'}
        </span>
      )
    },
    {
      key: 'price',
      label: 'Price',
      width: '120px',
      align: 'right' as const,
      render: (value: any) => value === 0 ? (
        <span className="badge bg-success">Free</span>
      ) : (
        renderPrice(value)
      )
    },
    {
      key: 'storeLimit',
      label: 'Stores',
      width: '100px',
      align: 'center' as const,
      render: (value: any) => value === -1 ? '∞' : value
    },
    {
      key: 'productLimit',
      label: 'Products',
      width: '100px',
      align: 'center' as const,
      render: (value: any) => value === -1 ? '∞' : value
    },
    {
      key: 'userLimit',
      label: 'Users',
      width: '100px',
      align: 'center' as const,
      render: (value: any) => value === -1 ? '∞' : value
    },
    {
      key: 'isSuperAdminPackage',
      label: 'Admin',
      width: '100px',
      align: 'center' as const,
      render: (value: any) => renderBadge(value ? 'Yes' : 'No', value ? 'warning' : 'secondary')
    },
    createStatusColumn()
  ],
  
  actions: [
    {
      key: 'edit',
      label: 'Edit',
      icon: 'bi bi-pencil',
      variant: 'primary' as const,
      onClick: (row: any) => console.log('Edit package', row)
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: 'bi bi-trash',
      variant: 'danger' as const,
      onClick: (row: any) => console.log('Delete package', row)
    }
  ]
};

export default {
  UserTablePreset,
  StoreTablePreset,
  ProductTablePreset,
  CategoryTablePreset,
  OrderTablePreset,
  PackageTablePreset
};
