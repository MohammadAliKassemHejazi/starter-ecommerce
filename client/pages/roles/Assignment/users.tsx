import React from "react";
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

  React.useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  const handleAssignRole = async (userId: string, roleId: string) => {
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

  return (
    <Layout>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <h1 className="mb-4 text-center fw-bold">User-Role Assignment</h1>
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

export default UserRoleGrid;