import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  assignRoleToUser,
  removeRoleFromUser,
  usersSelector,
} from "@/store/slices/myUsersSlice";
import { useAppDispatch } from "@/store/store";
import { fetchRoles, rolesSelector } from "@/store/slices/roleSlice";
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

const UserRoleGrid = () => {
  const dispatch = useAppDispatch();
  const roles = useSelector(rolesSelector);
  const users = useSelector(usersSelector);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    dispatch(fetchRoles());
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

  const handleAssignRole = async (userId: string, roleId: string) => {
    if (!isSuperAdmin) {
      Toast.fire({
        icon: "error",
        title: "Only super admins can assign roles to users",
      });
      return;
    }

    try {
      await dispatch(assignRoleToUser({ userId, roleId }));
      Toast.fire({
        icon: "success",
        title: "Role assigned successfully",
      });
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Failed to assign role",
      });
    }
  };

  const handleRemoveRole = async (userId: string, roleId: string) => {
    if (!isSuperAdmin) {
      Toast.fire({
        icon: "error",
        title: "Only super admins can remove roles from users",
      });
      return;
    }

    try {
      await dispatch(removeRoleFromUser({ userId, roleId }));
      Toast.fire({
        icon: "success",
        title: "Role removed successfully",
      });
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Failed to remove role",
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
              <h1 className="mb-4 text-center fw-bold">User-Role Assignment</h1>
              <div className="alert alert-warning">
                <h4>Access Denied</h4>
                <p>Only super admins can manage user-role assignments.</p>
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
            <h1 className="mb-4 text-center fw-bold">User-Role Assignment</h1>
            <div className="alert alert-info">
              <h5>Super Admin Access</h5>
              <p>You have super admin privileges to manage user-role assignments for your organization.</p>
            </div>
            <div className="table-responsive shadow-sm bg-white">
              <table className="table table-hover table-bordered border-secondary">
                <thead className="bg-dark text-light text-center">
                  <tr>
                    <th scope="col">User</th>
                    <th scope="col">Current Role</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((user: any) => (
                    <tr key={user.id} className="align-middle">
                      <td className="fw-semibold">{user.name}</td>
                      <td>{user.role?.name || "None"}</td>
                      <td>
                        <div className="d-flex gap-2">
                          {/* Role Selector */}
                          <select
                            id={`user-${user.id}`}
                            className="form-select form-select-sm flex-grow-1"
                            defaultValue=""
                          >
                            <option value="" disabled>
                              Select Role
                            </option>
                            {roles.map((role: any) => (
                              <option key={role.id} value={role.id}>
                                {role.name}
                              </option>
                            ))}
                          </select>

                          {/* Assign Button */}
                          <button
                            className="btn btn-success btn-sm"
                            onClick={(e) => {
                              e.preventDefault();
                              const selectElement = document.querySelector(
                                `#user-${user.id}`
                              ) as HTMLSelectElement;
                              if (selectElement && selectElement.value) {
                                Swal.fire({
                                  title: "Are you sure?",
                                  text: `Assign role "${roles.find(
                                    (r: any) => r.id === selectElement.value
                                  )?.name}" to user "${user.name}"?`,
                                  icon: "question",
                                  showCancelButton: true,
                                  confirmButtonText: "Assign",
                                }).then((result) => {
                                  if (result.isConfirmed) {
                                    handleAssignRole(user.id, selectElement.value);
                                  }
                                });
                              }
                            }}
                          >
                            Assign
                          </button>

                          {/* Remove Button */}
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={(e) => {
                              e.preventDefault();
                              const selectElement = document.querySelector(
                                `#user-${user.id}`
                              ) as HTMLSelectElement;
                              if (selectElement && selectElement.value) {
                                Swal.fire({
                                  title: "Are you sure?",
                                  text: `Remove role "${roles.find(
                                    (r: any) => r.id === selectElement.value
                                  )?.name}" from user "${user.name}"?`,
                                  icon: "warning",
                                  showCancelButton: true,
                                  confirmButtonText: "Remove",
                                }).then((result) => {
                                  if (result.isConfirmed) {
                                    handleRemoveRole(user.id, selectElement.value);
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

export default function ProtectedUserRoleGrid() {
  return (
    <ProtectedRoute>
      <UserRoleGrid />
    </ProtectedRoute>
  );
}