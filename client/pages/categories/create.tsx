// @/pages/categories/create.tsx
import React, { useState } from "react";
import Swal from "sweetalert2";
import { createCategory } from "@/store/slices/categorySlice";
import { useAppDispatch } from "@/store/store";

const CreateCategoryModal = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const dispatch = useAppDispatch();

  const handleSubmit = async () => {
    try {
      await dispatch(createCategory({ name, description }));
      Swal.fire("Success", "Category created successfully", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to create category", "error");
    }
  };

  return (
    <div>
      <h3>Create Category</h3>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <button onClick={handleSubmit}>Create</button>
    </div>
  );
};

export default CreateCategoryModal;