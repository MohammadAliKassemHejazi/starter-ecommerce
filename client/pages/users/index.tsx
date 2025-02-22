import React from "react";
import { useSelector } from "react-redux";
import { fetchUsersByCreator, deleteUser, usersSelector } from "@/store/slices/myUsersSlice";
import Swal from "sweetalert2";
import { useAppDispatch } from "@/store/store";

const UsersGrid = () => {
  const dispatch = useAppDispatch();
  const users = useSelector(usersSelector);

  React.useEffect(() => {
    dispatch(fetchUsersByCreator());
  }, [dispatch]);

  const handleDeleteUser = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await dispatch(deleteUser(id));
        Swal.fire("Deleted!", "User has been deleted.", "success");
      }
    });
  };

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user: any) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role?.name || "None"}</td>
              <td>
                <button>Edit</button>
                <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                <button>Assign Role</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersGrid;