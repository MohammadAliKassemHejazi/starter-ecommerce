import React from "react";
import { useSelector } from "react-redux";
import { fetchRoles, deleteRole, rolesSelector } from "@/store/slices/roleSlice";
import { useAppDispatch } from "@/store/store";
import { TablePage } from "@/components/UI/PageComponents";
import { usePageData } from "@/hooks/usePageData";
import ProtectedRoute from "@/components/protectedRoute";
import router from "next/router";

const RolesGrid = () => {
  const dispatch = useAppDispatch();
  const roles = useSelector(rolesSelector);
  const { isSuperAdmin, loading } = usePageData({ loadUserPackage: true });

  React.useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  const handleDeleteRole = async (id: string) => {
    await dispatch(deleteRole(id));
  };

  const handleEditRole = (role: any) => {
    router.push({
      pathname: '/roles/edit',
      query: { role: JSON.stringify(role) }
    });
  };

  const handleAssignPermissions = (role: any) => {
    router.push({
      pathname: '/roles/Assignment',
      query: { role: JSON.stringify(role) }
    });
  };

  // Table columns for roles
  const roleColumns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value: string) => <span className="fw-semibold">{value}</span>
    },
    {
      key: 'permissions',
      label: 'Permissions',
      render: (value: any[]) => (
        <div>
          {value?.length > 0
            ? value.map((perm: any) => (
                <span key={perm.id} className="badge bg-secondary me-1 mb-1">
                  {perm.name}
                </span>
              ))
            : <span className="text-muted">None</span>
          }
        </div>
      )
    }
  ];

  if (!isSuperAdmin) {
    return (
      <TablePage
        title="Roles"
        subtitle="Manage roles and permissions"
        data={[]}
        columns={roleColumns}
        loading={false}
        emptyMessage="Access Denied - Only super admins can manage roles and permissions"
        headerActions={
          <div className="alert alert-warning mb-0">
            <h6 className="mb-1">Access Denied</h6>
            <p className="mb-0">Only super admins can manage roles and permissions.</p>
          </div>
        }
      />
    );
  }

  return (
    <>
      <div className="alert alert-info mb-4">
        <h5>Super Admin Access</h5>
        <p>You have super admin privileges to manage roles and permissions for your organization.</p>
      </div>

      <TablePage
        title="Roles Management"
        subtitle="Manage roles and permissions for your organization"
        data={roles || []}
        columns={roleColumns}
        loading={loading}
        searchPlaceholder="Search roles..."
        emptyMessage="No roles found. Create your first role to get started!"
        addButton={{ href: '/roles/create', label: 'New Role' }}
        editPath="/roles/edit"
        deleteAction={handleDeleteRole}
        exportButton={{ onClick: () => console.log('Export roles') }}
        filterButton={{ onClick: () => console.log('Filter roles') }}
        customActions={[
          {
            key: 'edit',
            label: 'Edit',
            icon: 'bi bi-pencil',
            variant: 'primary',
            onClick: handleEditRole
          },
          {
            key: 'delete',
            label: 'Delete',
            icon: 'bi bi-trash',
            variant: 'danger',
            onClick: (role) => handleDeleteRole(role.id)
          },
          {
            key: 'assign',
            label: 'Assign Permissions',
            icon: 'bi bi-gear',
            variant: 'success',
            onClick: handleAssignPermissions
          }
        ]}
        headerActions={
          <div className="d-flex align-items-center gap-3">
            <span className="text-muted">
              Total Roles: {roles?.length || 0}
            </span>
            <button 
              className="btn btn-primary"
              onClick={() => router.push('/roles/create')}
            >
              New Role
            </button>
          </div>
        }
      />
    </>
  );
};

export default function ProtectedRolesGrid() {
  return (
    <ProtectedRoute>
      <RolesGrid />
    </ProtectedRoute>
  );
}