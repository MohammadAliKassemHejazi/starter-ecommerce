import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { TablePage } from '@/components/UI/PageComponents';
import { usePageData } from '@/hooks/usePageData';
import { useTranslation } from 'react-i18next';
import { showToast, showConfirm } from '@/components/UI/PageComponents/ToastConfig';
import ProtectedRoute from "@/components/protectedRoute";

interface Package {
  id: string;
  name: string;
  description?: string;
  storeLimit: number;
  categoryLimit: number;
  createdAt: string;
  updatedAt: string;
}

const PackagesPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { isAuthenticated } = usePageData();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/packages');
      if (response.ok) {
        const data = await response.json();
        setPackages(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
      showToast.error('Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePackage = async (id: string) => {
    const result = await showConfirm({
      title: 'Delete Package',
      text: 'Are you sure you want to delete this package?',
      confirmText: 'Yes, delete it!',
      cancelText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/packages/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setPackages(packages.filter(pkg => pkg.id !== id));
          showToast.success('Package deleted successfully');
        } else {
          throw new Error('Failed to delete package');
        }
      } catch (error) {
        console.error('Error deleting package:', error);
        showToast.error('Failed to delete package');
      }
    }
  };

  const handleEditPackage = (pkg: Package) => {
    router.push({
      pathname: '/packages/edit',
      query: { package: JSON.stringify(pkg) }
    });
  };

  // Table columns for packages
  const packageColumns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value: string) => <span className="fw-semibold">{value}</span>
    },
    {
      key: 'description',
      label: 'Description',
      render: (value: string) => (
        <div className="text-truncate" style={{ maxWidth: "200px" }} title={value}>
          {value || "N/A"}
        </div>
      )
    },
    {
      key: 'storeLimit',
      label: 'Store Limit',
      render: (value: number) => value === -1 ? 'Unlimited' : value
    },
    {
      key: 'categoryLimit',
      label: 'Category Limit',
      render: (value: number) => value === -1 ? 'Unlimited' : value
    },
    {
      key: 'createdAt',
      label: 'Created At',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString()
    }
  ];

  return (
    <TablePage
      title="Packages"
      subtitle="Manage subscription packages"
      data={packages}
      columns={packageColumns}
      loading={loading}
      searchPlaceholder="Search packages..."
      emptyMessage="No packages found. Create your first package to get started!"
      addButton={{ href: '/packages/create', label: 'New Package' }}
      editPath="/packages/edit"
      deleteAction={handleDeletePackage}
      exportButton={{ onClick: () => console.log('Export packages') }}
      filterButton={{ onClick: () => console.log('Filter packages') }}
      customActions={[
        {
          key: 'edit',
          label: 'Edit',
          icon: 'bi bi-pencil',
          variant: 'primary',
          onClick: handleEditPackage
        },
        {
          key: 'delete',
          label: 'Delete',
          icon: 'bi bi-trash',
          variant: 'danger',
          onClick: (pkg) => handleDeletePackage(pkg.id)
        }
      ]}
      headerActions={
        <div className="d-flex align-items-center gap-3">
          <span className="text-muted">
            Total Packages: {packages.length}
          </span>
          <button 
            className="btn btn-primary"
            onClick={() => router.push('/packages/create')}
          >
            New Package
          </button>
        </div>
      }
    />
  );
};

export default function ProtectedPackagesPage() {
  return (
    <ProtectedRoute>
      <PackagesPage />
    </ProtectedRoute>
  );
}