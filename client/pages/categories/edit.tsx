// @/pages/categories/edit.tsx
import React, { useState } from "react";
import Swal from "sweetalert2";
import { updateCategory } from "@/store/slices/categorySlice";
import { useAppDispatch } from "@/store/store";

const EditCategoryModal = ({ category }: { category: any }) => {
  const [name, setName] = useState<string>(category.name || "");
  const [description, setDescription] = useState<string>(category.description || "");
  const dispatch = useAppDispatch();

  const handleSubmit = async () => {
    try {
      await dispatch(updateCategory({ id: category.id, name, description }));
      Swal.fire("Success", "Category updated successfully", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to update category", "error");
    }
  };

  return (
    <div>
      <h3>Edit Category</h3>
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
      <button onClick={handleSubmit}>Update</button>
    </div>
  );
};

export default EditCategoryModal;