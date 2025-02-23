import React from "react";
import { useSelector } from "react-redux";
import { fetchRoles, deleteRole, rolesSelector } from "@/store/slices/roleSlice";
import { useAppDispatch } from "@/store/store";
import Swal from "sweetalert2";
import Layout from "@/components/Layouts/Layout";

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

const RolesGrid = () => {
  const dispatch = useAppDispatch();
  const roles = useSelector(rolesSelector);

  React.useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  const handleDeleteRole = async (id: string) => {
    Swal.fire({
      title: "Do you want to delete this role?",
      html: `
        <p><strong>ID:</strong> ${id}</p>
      `,
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        try {
          const response = await dispatch(deleteRole(id));
          if (response.meta.requestStatus === "fulfilled") {
            Toast.fire({
              icon: "success",
              title: "Role deleted successfully",
            });
          } else {
            Toast.fire({
              icon: "error",
              title: "Failed to delete role",
            });
          }
        } catch (error) {
          Toast.fire({
            icon: "error",
            title: "An error occurred while deleting the role",
          });
        }
      }
    });
  };

  return (
    <Layout>
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <h1 className="mb-4 text-center fw-bold">Roles</h1>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <span className="text-muted">
              Total Roles: {roles?.length || 0}
            </span>
            <button className="btn btn-primary">New Role</button>
          </div>
          <div className="table-responsive shadow-sm bg-white">
            <table className="table table-hover table-bordered border-secondary">
              <thead className="bg-dark text-light text-center">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Permissions</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {roles?.map((role: any, idx: number) => (
                  <tr key={role.id} className="align-middle text-center">
                    <td>{idx + 1}</td>
                    <td className="fw-semibold">{role.name}</td>
                    <td>
                      {role.permissions?.length > 0
                        ? role.permissions.map((perm: any) => perm.name).join(", ")
                        : "None"}
                    </td>
                    <td>
                      <div className="btn-group">
                        <button className="btn btn-primary btn-sm me-2">Edit</button>
                        <button
                          className="btn btn-danger btn-sm me-2"
                          onClick={() => handleDeleteRole(role.id)}
                        >
                          Delete
                        </button>
                        <button className="btn btn-success btn-sm">Assign Permissions</button>
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

export default RolesGrid;