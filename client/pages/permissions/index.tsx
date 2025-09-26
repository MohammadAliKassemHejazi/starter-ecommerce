import React from "react";
import { useSelector } from "react-redux";
import { fetchPermissions, deletePermission, permissionsSelector } from "@/store/slices/permissionSlice";
import { useAppDispatch } from "@/store/store";
import { TablePage } from "@/components/UI/PageComponents";
import { usePageData } from "@/hooks/usePageData";
import ProtectedRoute from "@/components/protectedRoute";
import router from "next/router";

const PermissionsGrid = () => {
  const dispatch = useAppDispatch();
  const permissions = useSelector(permissionsSelector);
  const { isAuthenticated } = usePageData();

  React.useEffect(() => {
    dispatch(fetchPermissions());
  }, [dispatch]);

  const handleDeletePermission = async (id: string) => {
    await dispatch(deletePermission(id));
  };

  const handleEditPermission = (permission: any) => {
    router.push({
      pathname: '/permissions/edit',
      query: { permission: JSON.stringify(permission) }
    });
  };

  // Table columns for permissions
  const permissionColumns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value: string) => <span className="fw-semibold">{value}</span>
    }
  ];

  return (
    <TablePage
      title="Permissions"
      subtitle="Manage system permissions"
      data={permissions || []}
      columns={permissionColumns}
      searchPlaceholder="Search permissions..."
      emptyMessage="No permissions found. Create your first permission to get started!"
      addButton={{ href: '/permissions/create', label: 'New Permission' }}
      editPath="/permissions/edit"
      deleteAction={handleDeletePermission}
      exportButton={{ onClick: () => console.log('Export permissions') }}
      filterButton={{ onClick: () => console.log('Filter permissions') }}
      customActions={[
        {
          key: 'edit',
          label: 'Edit',
          icon: 'bi bi-pencil',
          variant: 'primary',
          onClick: handleEditPermission
        },
        {
          key: 'delete',
          label: 'Delete',
          icon: 'bi bi-trash',
          variant: 'danger',
          onClick: (permission) => handleDeletePermission(permission.id)
        }
      ]}
      headerActions={
        <div className="d-flex align-items-center gap-3">
          <span className="text-muted">
            Total Permissions: {permissions?.length || 0}
          </span>
          <button 
            className="btn btn-primary"
            onClick={() => router.push('/permissions/create')}
          >
            New Permission
          </button>
        </div>
      }
    />
  );
};

export default function ProtectedPermissionsGrid() {
  return (
    <ProtectedRoute>
      <PermissionsGrid />
    </ProtectedRoute>
  );
}