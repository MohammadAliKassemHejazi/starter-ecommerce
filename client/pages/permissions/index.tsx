import React from "react";
import { useSelector } from "react-redux";
import { fetchPermissions, deletePermission, permissionsSelector } from "@/store/slices/permissionSlice";
import { useAppDispatch } from "@/store/store";
import Swal from "sweetalert2";
import Layout from "@/components/Layouts/Layout";
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

const PermissionsGrid = () => {
  const dispatch = useAppDispatch();
  const permissions = useSelector(permissionsSelector);

  React.useEffect(() => {
    dispatch(fetchPermissions());
  }, [dispatch]);

  const handleDeletePermission = async (id: string) => {
    Swal.fire({
      title: "Do you want to delete this permission?",
      html: `
        <p><strong>ID:</strong> ${id}</p>
      `,
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await dispatch(deletePermission(id));
          if (response.meta.requestStatus === "fulfilled") {
            Toast.fire({
              icon: "success",
              title: "Permission deleted successfully",
            });
          } else {
            Toast.fire({
              icon: "error",
              title: "Failed to delete permission",
            });
          }
        } catch (error) {
          Toast.fire({
            icon: "error",
            title: "An error occurred while deleting the permission",
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
          <h1 className="mb-4 text-center fw-bold">Permissions</h1>
          <div className="d-flex justify-content-between align-items-center mb-4">
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
          <div className="table-responsive shadow-sm bg-white">
            <table className="table table-hover table-bordered border-secondary">
              <thead className="bg-dark text-light text-center">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {permissions?.map((perm: any, idx: number) => (
                  <tr key={perm.id} className="align-middle text-center">
                    <td>{idx + 1}</td>
                    <td className="fw-semibold">{perm.name}</td>
                    <td>
                      <div className="btn-group">
                        <button 
                          className="btn btn-primary btn-sm me-2"
                          onClick={() => router.push({
                            pathname: '/permissions/edit',
                            query: { permission: JSON.stringify(perm) }
                          })}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeletePermission(perm.id)}
                        >
                          Delete
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

export default PermissionsGrid;