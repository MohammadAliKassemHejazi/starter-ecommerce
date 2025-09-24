import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  fetchPermissions,
  addPermissionToRole,
  removePermissionFromRole,
  permissionsSelector,
} from "@/store/slices/permissionSlice";
import { useAppDispatch } from "@/store/store";
import { rolesSelector } from "@/store/slices/roleSlice";
import Layout from "@/components/Layouts/Layout";
import Swal from "sweetalert2";
import { getUserActivePackage } from "@/services/packageService";
import ProtectedRoute from "@/components/protectedRoute";

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
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    dispatch(fetchPermissions());
    loadUserPackage();
  }, [dispatch]);

  const loadUserPackage = async () => {
    try {
      const packageData = await getUserActivePackage();
      setIsSuperAdmin(packageData?.Package?.isSuperAdminPackage || false);
    } catch (error) {
      console.error('Error loading user package:', error);
    } finally {
      setLoading(false);
    }
  };

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
      await dispatch(removePermissionFromRole({ roleId, permissionId }));
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

  if (loading) {
    return (
      <Layout>
        <div className="container mt-5">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isSuperAdmin) {
    return (
      <Layout>
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-10">
              <h1 className="mb-4 text-center fw-bold">Role-Permission Assignment</h1>
              <div className="alert alert-warning">
                <h4>Access Denied</h4>
                <p>Only super admins can manage role-permission assignments.</p>
                <p>Please contact your administrator or upgrade your package.</p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <h1 className="mb-4 text-center fw-bold">Role-Permission Assignment</h1>
            <div className="alert alert-info">
              <h5>Super Admin Access</h5>
              <p>You have super admin privileges to manage role-permission assignments for your organization.</p>
            </div>
            <div className="table-responsive shadow-sm bg-white">
              <table className="table table-hover table-bordered border-secondary">
                <thead className="bg-dark text-light text-center">
                  <tr>
                    <th scope="col">Role</th>
                    <th scope="col">Assigned Permissions</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {roles?.map((role: any) => (
                    <tr key={role.id} className="align-middle">
                      <td className="fw-semibold">{role.name}</td>
                      <td>
                        {role.permissions?.length > 0
                          ? role.permissions.map((perm: any) => perm.name).join(", ")
                          : "None"}
                      </td>
                      <td>
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
                            {permissions.map((perm: any) => (
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
                              const selectElement = document.querySelector(
                                `#role-${role.id}`
                              ) as HTMLSelectElement;
                              if (selectElement && selectElement.value) {
                                Swal.fire({
                                  title: "Are you sure?",
                                  text: `Add permission "${permissions.find(
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
                              const selectElement = document.querySelector(
                                `#role-${role.id}`
                              ) as HTMLSelectElement;
                              if (selectElement && selectElement.value) {
                                Swal.fire({
                                  title: "Are you sure?",
                                  text: `Remove permission "${permissions.find(
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default function ProtectedRolePermissionGrid() {
  return (
    <ProtectedRoute>
      <RolePermissionGrid />
    </ProtectedRoute>
  );
}