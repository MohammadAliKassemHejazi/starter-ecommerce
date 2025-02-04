import React, { useState } from "react";
import Swal from "sweetalert2";
import { createRole } from "@/store/slices/roleSlice";
import { useAppDispatch } from "@/store/store";

const CreateRoleModal = () => {
  const [name, setName] = useState<string>("");
  const dispatch = useAppDispatch();

  const handleSubmit = async () => {
    try {
      await dispatch(createRole({ name }));
      Swal.fire("Success", "Role created successfully", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to create role", "error");
    }
  };

  return (
    <div>
      <h3>Create Role</h3>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Role Name"
      />
      <button onClick={handleSubmit}>Create</button>
    </div>
  );
};

export default CreateRoleModal;