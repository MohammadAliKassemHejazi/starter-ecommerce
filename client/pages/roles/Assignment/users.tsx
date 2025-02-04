import React from "react";
import { useSelector } from "react-redux";
import {  assignRoleToUser, removeRoleFromUser } from "@/store/slices/myusersSlice";
import { useAppDispatch } from "@/store/store";
import { fetchRoles } from "@/store/slices/roleSlice";


const UserRoleGrid = () => {
  const dispatch = useAppDispatch();
  const roles = useSelector((state: any) => state.role.roles);
  const users = useSelector((state: any) => state.user.users);

  React.useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  const handleAssignRole = (userId: string, roleId: string) => {
    dispatch(assignRoleToUser({ userId, roleId }));
  };

  const handleRemoveRole = (userId: string, roleId: string) => {
    dispatch(removeRoleFromUser({ userId, roleId }));
  };

  return (
    <div>
      <h2>User-Role Assignment</h2>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user: any) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.role?.name || "None"}</td>
              <td>
                <select>
                  {roles.map((role: any) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
                <button onClick={() => handleAssignRole(user.id, "selectedRoleId")}>Assign</button>
                <button onClick={() => handleRemoveRole(user.id, "selectedRoleId")}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserRoleGrid;