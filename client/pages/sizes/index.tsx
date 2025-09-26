import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { TablePage } from '@/components/UI/PageComponents';
import { usePageData } from '@/hooks/usePageData';
import { useTranslation } from 'react-i18next';
import { showToast, showConfirm } from '@/components/UI/PageComponents/ToastConfig';
import ProtectedRoute from '@/components/protectedRoute';

interface Size {
  id: string;
  size: string;
  createdAt: string;
  updatedAt: string;
}

interface SizeItem {
  id: string;
  productId: string;
  sizeId: string;
  quantity: number;
  Product?: {
    id: string;
    name: string;
  };
  Size?: {
    id: string;
    size: string;
  };
  createdAt: string;
}

const SizesPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { isAuthenticated } = usePageData();
  const [sizes, setSizes] = useState<Size[]>([]);
  const [sizeItems, setSizeItems] = useState<SizeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'sizes' | 'items'>('sizes');

  useEffect(() => {
    fetchSizes();
    fetchSizeItems();
  }, []);

  const fetchSizes = async () => {
    try {
      const response = await fetch('/api/sizes');
      if (response.ok) {
        const data = await response.json();
        setSizes(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching sizes:', error);
    }
  };

  const fetchSizeItems = async () => {
    try {
      const response = await fetch('/api/sizes/items');
      if (response.ok) {
        const data = await response.json();
        setSizeItems(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching size items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSize = async (id: string) => {
    const result = await showConfirm({
      title: 'Delete Size',
      text: 'Are you sure you want to delete this size?',
      confirmText: 'Yes, delete it!',
      cancelText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/sizes/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setSizes(sizes.filter(size => size.id !== id));
          showToast.success('Size deleted successfully');
        } else {
          throw new Error('Failed to delete size');
        }
      } catch (error) {
        console.error('Error deleting size:', error);
        showToast.error('Failed to delete size');
      }
    }
  };

  const handleDeleteSizeItem = async (id: string) => {
    const result = await showConfirm({
      title: 'Delete Size Item',
      text: 'Are you sure you want to delete this size item?',
      confirmText: 'Yes, delete it!',
      cancelText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/sizes/items/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setSizeItems(sizeItems.filter(item => item.id !== id));
          showToast.success('Size item deleted successfully');
        } else {
          throw new Error('Failed to delete size item');
        }
      } catch (error) {
        console.error('Error deleting size item:', error);
        showToast.error('Failed to delete size item');
      }
    }
  };

  const handleEditSize = (size: Size) => {
    router.push({
      pathname: '/sizes/edit',
      query: { size: JSON.stringify(size) }
    });
  };

  const handleEditSizeItem = (item: SizeItem) => {
    router.push({
      pathname: '/sizes/items/edit',
      query: { item: JSON.stringify(item) }
    });
  };

  // Table columns for sizes
  const sizeColumns = [
    {
      key: 'size',
      label: 'Size',
      sortable: true,
      render: (value: string) => <span className="fw-semibold">{value}</span>
    },
    {
      key: 'createdAt',
      label: 'Created At',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString()
    }
  ];

  // Table columns for size items
  const sizeItemColumns = [
    {
      key: 'Product',
      label: 'Product',
      render: (value: any) => value?.name || 'N/A'
    },
    {
      key: 'Size',
      label: 'Size',
      render: (value: any) => value?.size || 'N/A'
    },
    {
      key: 'quantity',
      label: 'Quantity',
      sortable: true,
      render: (value: number) => <span className="fw-semibold">{value}</span>
    }
  ];

  const SizesTab = () => (
    <TablePage
      title="Sizes"
      subtitle="Manage product sizes"
      data={sizes}
      columns={sizeColumns}
      loading={loading}
      searchPlaceholder="Search sizes..."
      emptyMessage="No sizes found. Create your first size to get started!"
      addButton={{ href: '/sizes/create', label: 'New Size' }}
      editPath="/sizes/edit"
      deleteAction={handleDeleteSize}
      exportButton={{ onClick: () => console.log('Export sizes') }}
      filterButton={{ onClick: () => console.log('Filter sizes') }}
      customActions={[
        {
          key: 'edit',
          label: 'Edit',
          icon: 'bi bi-pencil',
          variant: 'primary',
          onClick: handleEditSize
        },
        {
          key: 'delete',
          label: 'Delete',
          icon: 'bi bi-trash',
          variant: 'danger',
          onClick: (size) => handleDeleteSize(size.id)
        }
      ]}
      headerActions={
        <div className="d-flex align-items-center gap-3">
          <span className="text-muted">
            Total Sizes: {sizes.length}
          </span>
          <button 
            className="btn btn-primary"
            onClick={() => router.push('/sizes/create')}
          >
            New Size
          </button>
        </div>
      }
    />
  );

  const SizeItemsTab = () => (
    <TablePage
      title="Size Items"
      subtitle="Manage product size inventory"
      data={sizeItems}
      columns={sizeItemColumns}
      loading={loading}
      searchPlaceholder="Search size items..."
      emptyMessage="No size items found. Create your first size item to get started!"
      addButton={{ href: '/sizes/items/create', label: 'New Size Item' }}
      editPath="/sizes/items/edit"
      deleteAction={handleDeleteSizeItem}
      exportButton={{ onClick: () => console.log('Export size items') }}
      filterButton={{ onClick: () => console.log('Filter size items') }}
      customActions={[
        {
          key: 'edit',
          label: 'Edit',
          icon: 'bi bi-pencil',
          variant: 'primary',
          onClick: handleEditSizeItem
        },
        {
          key: 'delete',
          label: 'Delete',
          icon: 'bi bi-trash',
          variant: 'danger',
          onClick: (item) => handleDeleteSizeItem(item.id)
        }
      ]}
      headerActions={
        <div className="d-flex align-items-center gap-3">
          <span className="text-muted">
            Total Size Items: {sizeItems.length}
          </span>
          <button 
            className="btn btn-primary"
            onClick={() => router.push('/sizes/items/create')}
          >
            New Size Item
          </button>
        </div>
      }
    />
  );

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4 text-center fw-bold">Size Management</h1>
          
          {/* Tabs */}
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'sizes' ? 'active' : ''}`}
                onClick={() => setActiveTab('sizes')}
              >
                Sizes
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'items' ? 'active' : ''}`}
                onClick={() => setActiveTab('items')}
              >
                Size Items
              </button>
            </li>
          </ul>

          {/* Tab Content */}
          {activeTab === 'sizes' && <SizesTab />}
          {activeTab === 'items' && <SizeItemsTab />}
        </div>
      </div>
    </div>
  );
};

export default function ProtectedSizesPage() {
  return (
    <ProtectedRoute>
      <SizesPage />
    </ProtectedRoute>
  );
}