import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { TablePage } from '@/components/UI/PageComponents';
import { usePageData } from '@/hooks/usePageData';
import { useTranslation } from 'react-i18next';
import { showToast, showConfirm } from '@/components/UI/PageComponents/ToastConfig';
import ProtectedRoute from "@/components/protectedRoute";
import { useAppDispatch } from '@/store/store';
import {
  getAllPackages,
  deletePackage,
  selectAllPackages,
  selectPackageLoading,
} from '@/store/slices/packageSlice';

interface Package {
  id: string;
  name: string;
  description?: string;
  storeLimit: number;
  categoryLimit: number;
  productLimit: number;
  userLimit: number;
  isSuperAdminPackage: boolean;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const PackagesPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = usePageData();
  const packages = useSelector(selectAllPackages) as Package[];
  const loading = useSelector(selectPackageLoading);

  useEffect(() => {
    dispatch(getAllPackages());
  }, [dispatch]);

  const handleDeletePackage = async (id: string) => {
    const result = await showConfirm({
      title: 'Delete Package',
      text: 'Are you sure you want to delete this package?',
      confirmText: 'Yes, delete it!',
      cancelText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deletePackage(id)).unwrap();
        showToast.success('Package deleted successfully');
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
