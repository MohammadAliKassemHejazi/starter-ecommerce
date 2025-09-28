import React, { useState } from 'react';
import { ModernTable, TableColumn, TableAction } from '@/components/UI/ModernTable';
import { renderBadge, renderDate, renderPrice, renderStatus } from '@/components/UI/ModernTable/TableUtils';
import { PageLayout } from '@/components/UI/PageComponents';

// Sample data
const sampleData = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    status: true,
    createdAt: '2024-01-15T10:30:00Z',
    price: 99.99,
    category: 'Premium'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'User',
    status: false,
    createdAt: '2024-01-20T14:45:00Z',
    price: 49.99,
    category: 'Basic'
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'Moderator',
    status: true,
    createdAt: '2024-01-25T09:15:00Z',
    price: 149.99,
    category: 'Enterprise'
  }
];

const TableDemo = () => {
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  const columns: TableColumn[] = [
    {
      key: 'id',
      label: 'ID',
      width: '80px',
      align: 'center',
      render: (value) => <code className="small">{value}</code>
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value) => <span className="fw-semibold">{value}</span>
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      render: (value) => (
        <a href={`mailto:${value}`} className="text-decoration-none">
          <i className="bi bi-envelope me-1"></i>
          {value}
        </a>
      )
    },
    {
      key: 'role',
      label: 'Role',
      width: '120px',
      align: 'center',
      render: (value) => renderBadge(value, 'info')
    },
    {
      key: 'status',
      label: 'Status',
      width: '100px',
      align: 'center',
      render: renderStatus
    },
    {
      key: 'price',
      label: 'Price',
      width: '120px',
      align: 'right',
      render: renderPrice
    },
    {
      key: 'createdAt',
      label: 'Created',
      width: '150px',
      sortable: true,
      render: (value) => renderDate(value, 'short')
    }
  ];

  const actions: TableAction[] = [
    {
      key: 'view',
      label: 'View',
      icon: 'bi bi-eye',
      variant: 'info',
      onClick: (row) => console.log('View', row)
    },
    {
      key: 'edit',
      label: 'Edit',
      icon: 'bi bi-pencil',
      variant: 'primary',
      onClick: (row) => console.log('Edit', row)
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: 'bi bi-trash',
      variant: 'danger',
      onClick: (row) => console.log('Delete', row)
    }
  ];

  const handleRowClick = (row: any) => {
    console.log('Row clicked:', row);
  };

  const handleSelectionChange = (selected: any[]) => {
    setSelectedRows(selected);
    console.log('Selected rows:', selected);
  };

  const FeaturesList = () => (
    <div className="mt-4">
      <h5>Features Demonstrated:</h5>
      <ul className="list-unstyled">
        <li><i className="bi bi-check-circle text-success me-2"></i>Modern, responsive design</li>
        <li><i className="bi bi-check-circle text-success me-2"></i>Search functionality</li>
        <li><i className="bi bi-check-circle text-success me-2"></i>Sorting by columns</li>
        <li><i className="bi bi-check-circle text-success me-2"></i>Pagination</li>
        <li><i className="bi bi-check-circle text-success me-2"></i>Row selection</li>
        <li><i className="bi bi-check-circle text-success me-2"></i>Custom column renderers</li>
        <li><i className="bi bi-check-circle text-success me-2"></i>Action buttons</li>
        <li><i className="bi bi-check-circle text-success me-2"></i>Empty state handling</li>
        <li><i className="bi bi-check-circle text-success me-2"></i>Loading states</li>
        <li><i className="bi bi-check-circle text-success me-2"></i>Responsive design</li>
      </ul>
    </div>
  );

  return (
    <PageLayout 
      title="Modern Table Demo" 
      subtitle="Demonstration of the ModernTable component features"
      protected={false}
    >
      {selectedRows.length > 0 && (
        <div className="alert alert-info mb-4">
          <i className="bi bi-info-circle me-2"></i>
          {selectedRows.length} row(s) selected
          <button 
            className="btn btn-sm btn-outline-danger ms-3"
            onClick={() => setSelectedRows([])}
          >
            Clear Selection
          </button>
        </div>
      )}

      <ModernTable
        data={sampleData}
        columns={columns}
        actions={actions}
        searchable={true}
        searchPlaceholder="Search demo data..."
        pagination={true}
        pageSize={5}
        selectable={true}
        selectedRows={selectedRows}
        onSelectionChange={handleSelectionChange}
        onRowClick={handleRowClick}
        emptyMessage="No demo data found"
        headerActions={
          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary btn-sm">
              <i className="bi bi-funnel me-1"></i>
              Filter
            </button>
            <button className="btn btn-outline-secondary btn-sm">
              <i className="bi bi-gear me-1"></i>
              Settings
            </button>
          </div>
        }
      />

      <FeaturesList />
    </PageLayout>
  );
};

export default TableDemo;