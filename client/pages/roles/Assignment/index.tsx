import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  fetchPermissions,
  addPermissionToRole,
  removePermissionFromRole,
  permissionsSelector,
} from "@/store/slices/permissionSlice";
import { useAppDispatch } from "@/store/store";
import { rolesSelector, fetchRoles } from "@/store/slices/roleSlice";
import { TablePage } from "@/components/UI/PageComponents";
import Swal from "sweetalert2";
import ProtectedRoute from "@/components/protectedRoute";
import { usePageData } from "@/hooks/usePageData";
import router from "next/router";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

const RolePermissionGrid = () => {
  const dispatch = useAppDispatch();
  const permissions = useSelector(permissionsSelector);
  const roles = useSelector(rolesSelector);
  const { isSuperAdmin, loading } = usePageData({ loadUserPackage: true });

  useEffect(() => {
    dispatch(fetchPermissions());
    dispatch(fetchRoles());
  }, [dispatch]);

  const handleAddPermission = async (roleId: string, permissionId: string) => {
    if (!isSuperAdmin) {
      Toast.fire({
        icon: "error",
        title: "Only super admins can assign permissions",
      });
      return;
    }

    try {
      await dispatch(addPermissionToRole({ roleId, permissionId }));
      Toast.fire({
        icon: "success",
        title: "Permission added successfully",
      });
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Failed to add permission",
      });
    }
  };

  const handleRemovePermission = async (roleId: string, permissionId: string) => {
    if (!isSuperAdmin) {
      Toast.fire({
        icon: "error",
        title: "Only super admins can remove permissions",
      });
      return;
    }

    try {
      await dispatch(removePermissionFromRole({ roleId, permissionId })).unwrap();
      Toast.fire({
        icon: "success",
        title: "Permission removed successfully",
      });
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Failed to remove permission",
      });
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Role Name',
      sortable: true,
      render: (value: string) => <span className="fw-semibold">{value}</span>
    },
    {
      key: 'permissions',
      label: 'Assigned Permissions',
      render: (value: any[]) => (
        <div className="d-flex flex-wrap gap-1">
          {value?.length > 0
            ? value.map((perm: any) => (
                <span key={perm.id} className="badge bg-secondary">
                  {perm.name}
                </span>
              ))
            : <span className="text-muted">None</span>
          }
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_: any, role: any) => (
        <div className="d-flex gap-2">
          {/* Permission Selector */}
          <select
            id={`role-${role.id}`}
            className="form-select form-select-sm flex-grow-1"
            defaultValue=""
          >
            <option value="" disabled>
              Select Permission
            </option>
            {permissions?.map((perm: any) => (
              <option key={perm.id} value={perm.id}>
                {perm.name}
              </option>
            ))}
          </select>

          {/* Add Button */}
          <button
            className="btn btn-success btn-sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const selectElement = document.querySelector(
                `#role-${role.id}`
              ) as HTMLSelectElement;
              if (selectElement && selectElement.value) {
                Swal.fire({
                  title: "Are you sure?",
                  text: `Add permission "${permissions?.find(
                    (p: any) => p.id === selectElement.value
                  )?.name}" to role "${role.name}"?`,
                  icon: "question",
                  showCancelButton: true,
                  confirmButtonText: "Add",
                }).then((result) => {
                  if (result.isConfirmed) {
                    handleAddPermission(role.id, selectElement.value);
                  }
                });
              }
            }}
          >
            Add
          </button>

          {/* Remove Button */}
          <button
            className="btn btn-danger btn-sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const selectElement = document.querySelector(
                `#role-${role.id}`
              ) as HTMLSelectElement;
              if (selectElement && selectElement.value) {
                Swal.fire({
                  title: "Are you sure?",
                  text: `Remove permission "${permissions?.find(
                    (p: any) => p.id === selectElement.value
                  )?.name}" from role "${role.name}"?`,
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonText: "Remove",
                }).then((result) => {
                  if (result.isConfirmed) {
                    handleRemovePermission(role.id, selectElement.value);
                  }
                });
              }
            }}
          >
            Remove
          </button>
        </div>
      )
    }
  ];

  if (!isSuperAdmin) {
    return (
      <TablePage
        title="Role-Permission Assignment"
        subtitle="Manage role-permission assignments"
        data={[]}
        columns={columns}
        loading={false}
        emptyMessage="Access Denied - Only super admins can manage assignments"
        headerActions={
          <div className="alert alert-warning mb-0">
            <h6 className="mb-1">Access Denied</h6>
            <p className="mb-0">Only super admins can manage role-permission assignments.</p>
          </div>
        }
      />
    );
  }

  return (
    <>
      <div className="alert alert-info mb-4">
        <h5>Super Admin Access</h5>
        <p>You have super admin privileges to manage role-permission assignments for your organization.</p>
      </div>

      <TablePage
        title="Role-Permission Assignment"
        subtitle="Manage role-permission assignments for your organization"
        data={roles || []}
        columns={columns}
        loading={loading}
        searchPlaceholder="Search roles..."
        emptyMessage="No roles found."
        headerActions={
          <div className="d-flex align-items-center gap-3">
            <span className="text-muted">
              Total Roles: {roles?.length || 0}
            </span>
            <button
              className="btn btn-secondary"
              onClick={() => router.push('/roles')}
            >
              Back to Roles
            </button>
          </div>
        }
      />
    </>
  );
};

export default function ProtectedRolePermissionGrid() {
  return (
    <ProtectedRoute>
      <RolePermissionGrid />
    </ProtectedRoute>
  );
}
