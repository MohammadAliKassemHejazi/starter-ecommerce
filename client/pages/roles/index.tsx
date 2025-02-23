import React from "react";
import { useSelector,  } from "react-redux";
import { fetchRoles, deleteRole, rolesSelector } from "@/store/slices/roleSlice";
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
        id: ${id}
      `,
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then(async (result : any) => {
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
    <div>
      <h2>Roles</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Permissions</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {roles?.map((role: any) => (
            <tr key={role.id}>
              <td>{role.id}</td>
              <td>{role.name}</td>
              <td>
                {role.permissions?.map((perm: any) => perm.name).join(", ") || "None"}
              </td>
              <td>
                <button>Edit</button>
                <button onClick={() => handleDeleteRole(role.id)}>Delete</button>
                <button>Assign Permissions</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RolesGrid;