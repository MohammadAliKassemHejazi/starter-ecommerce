import React from "react";
import { useSelector } from "react-redux";
import { fetchPermissions, deletePermission, permissionsSelector } from "@/store/slices/permissionSlice";
import { useAppDispatch } from "@/store/store";
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
      id: ${id}
    `,
    showCancelButton: true,
    confirmButtonText: "Delete",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        // Dispatch the delete action
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
    <div>
      <h2>Permissions</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {permissions?.map((perm: any) => (
            <tr key={perm.id}>
              <td>{perm.id}</td>
              <td>{perm.name}</td>
              <td>
                <button>Edit</button>
                <button onClick={() => handleDeletePermission(perm.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PermissionsGrid;