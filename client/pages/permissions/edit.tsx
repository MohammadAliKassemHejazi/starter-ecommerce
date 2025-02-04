import React, { useState } from "react";
import Swal from "sweetalert2";
import { updatePermission } from "@/store/slices/permissionSlice";
import { useAppDispatch } from "@/store/store";

const EditPermissionModal = ({ permission }: { permission: any }) => {
  const [name, setName] = useState<string>(permission.name || "");
  const dispatch = useAppDispatch();

  const handleSubmit = async () => {
    try {
      await dispatch(updatePermission({ id: permission.id, name }));
      Swal.fire("Success", "Permission updated successfully", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to update permission", "error");
    }
  };

  return (
    <div>
      <h3>Edit Permission</h3>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Permission Name"
      />
      <button onClick={handleSubmit}>Update</button>
    </div>
  );
};

export default EditPermissionModal;