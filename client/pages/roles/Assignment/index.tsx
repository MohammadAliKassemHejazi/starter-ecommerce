import React from "react";
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

const RolePermissionGrid = () => {
  const dispatch = useAppDispatch();
  const permissions = useSelector(permissionsSelector);
  const roles = useSelector(rolesSelector);

  React.useEffect(() => {
    dispatch(fetchPermissions());
  }, [dispatch]);

  const handleAddPermission = (roleId: string, permissionId: string) => {
    dispatch(addPermissionToRole({ roleId, permissionId }));
  };

  const handleRemovePermission = (roleId: string, permissionId: string) => {
    dispatch(removePermissionFromRole({ roleId, permissionId }));
  };

  return (
     <Layout>
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <h1 className="mb-4 text-center fw-bold">Role-Permission Assignment</h1>
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
                          onClick={() => {
                            const selectElement = document.querySelector(
                              `#role-${role.id} select`
                            ) as HTMLSelectElement;
                            if (selectElement && selectElement.value) {
                              handleAddPermission(role.id, selectElement.value);
                            }
                          }}
                        >
                          Add
                        </button>

                        {/* Remove Button */}
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => {
                            const selectElement = document.querySelector(
                              `#role-${role.id} select`
                            ) as HTMLSelectElement;
                            if (selectElement && selectElement.value) {
                              handleRemovePermission(role.id, selectElement.value);
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

export default RolePermissionGrid;