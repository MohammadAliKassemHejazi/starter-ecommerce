// @/pages/subcategories/create.tsx
import React, { useState } from "react";
import Swal from "sweetalert2";
import { createSubCategory } from "@/store/slices/subCategorySlice";
import { useAppDispatch,  } from "@/store/store";
import { useSelector } from "react-redux";
import { categoriesSelector } from "@/store/slices/categorySlice";

const CreateSubCategoryModal = () => {
  const [name, setName] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const categories = useSelector(categoriesSelector);
  const dispatch = useAppDispatch();

  const handleSubmit = async () => {
    try {
      await dispatch(createSubCategory({ name, categoryId }));
      Swal.fire("Success", "Subcategory created successfully", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to create subcategory", "error");
    }
  };

  return (
    <div>
      <h3>Create SubCategory</h3>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
        <option value="">Select Category</option>
        {categories?.map((category: any) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <button onClick={handleSubmit}>Create</button>
    </div>
  );
};

export default CreateSubCategoryModal;