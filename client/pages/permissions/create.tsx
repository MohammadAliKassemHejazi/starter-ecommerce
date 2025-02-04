import React, { useState } from "react";
import Swal from "sweetalert2";
import { createPermission } from "@/store/slices/permissionSlice";
import { useAppDispatch } from "@/store/store";

const CreatePermissionModal = () => {
  const [name, setName] = useState<string>("");
    const dispatch = useAppDispatch();
    
  const handleSubmit = async () => {
    try {
      await dispatch(createPermission({ name }));
      Swal.fire("Success", "Permission created successfully", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to create permission", "error");
    }
  };

  return (
    <div>
      <h3>Create Permission</h3>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Permission Name"
      />
      <button onClick={handleSubmit}>Create</button>
    </div>
  );
};

export default CreatePermissionModal;