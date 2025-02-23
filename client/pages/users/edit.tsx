import React, { useState } from "react";
import Swal from "sweetalert2";
import { updateUser } from "@/store/slices/myUsersSlice";
import { useAppDispatch } from "@/store/store";

const EditUserModal = ({ user }: { user: any }) => {
  const [name, setName] = useState<string>(user.name || "");
  const [email, setEmail] = useState<string>(user.email || "");
  const dispatch = useAppDispatch();

  const handleSubmit = async () => {
    try {
      await dispatch(updateUser({ id: user.id, name, email }));
      Swal.fire("Success", "User updated successfully", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to update user", "error");
    }
  };

  return (
    <div>
      <h3>Edit User</h3>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <button onClick={handleSubmit}>Update</button>
    </div>
  );
};

export default EditUserModal;