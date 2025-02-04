import React, { useState } from "react";
import Swal from "sweetalert2";
import { updateRole } from "@/store/slices/roleSlice";
import { useAppDispatch } from "@/store/store";

const EditRoleModal = ({ role }: { role: any }) => {
  const [name, setName] = useState<string>(role.name || "");
  const dispatch = useAppDispatch();

  const handleSubmit = async () => {
    try {
      await dispatch(updateRole({ id: role.id, name }));
      Swal.fire("Success", "Role updated successfully", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to update role", "error");
    }
  };

  return (
    <div>
      <h3>Edit Role</h3>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Role Name"
      />
      <button onClick={handleSubmit}>Update</button>
    </div>
  );
};

export default EditRoleModal;