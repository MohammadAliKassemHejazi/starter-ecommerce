import React from "react";
import { useSelector, } from "react-redux";
import { fetchPermissions, addPermissionToRole, removePermissionFromRole } from "@/store/slices/permissionSlice";
import { useAppDispatch } from "@/store/store";

const RolePermissionGrid = () => {
  const dispatch = useAppDispatch();
  const permissions = useSelector((state: any) => state.permission.permissions);
  const roles = useSelector((state: any) => state.role.roles);

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
    <div>
      <h2>Role-Permission Assignment</h2>
      <table>
        <thead>
          <tr>
            <th>Role</th>
            <th>Permissions</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {roles?.map((role: any) => (
            <tr key={role.id}>
              <td>{role.name}</td>
              <td>
                {role.permissions?.map((perm: any) => perm.name).join(", ") || "None"}
              </td>
              <td>
                <select>
                  {permissions.map((perm: any) => (
                    <option key={perm.id} value={perm.id}>
                      {perm.name}
                    </option>
                  ))}
                </select>
                <button onClick={() => handleAddPermission(role.id, "selectedPermissionId")}>Add</button>
                <button onClick={() => handleRemovePermission(role.id, "selectedPermissionId")}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RolePermissionGrid;