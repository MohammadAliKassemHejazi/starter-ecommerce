// @/pages/subcategories/edit.tsx
import React, { useState } from "react";
import Swal from "sweetalert2";
import { updateSubCategory } from "@/store/slices/subCategorySlice";
import { useAppDispatch } from "@/store/store";
import { useSelector } from "react-redux";
import { categoriesSelector } from "@/store/slices/categorySlice";

const EditSubCategoryModal = ({ subCategory }: { subCategory: any }) => {
  const [name, setName] = useState<string>(subCategory.name || "");
  const [categoryId, setCategoryId] = useState<string>(subCategory.categoryId || "");
    const categories = useSelector(categoriesSelector);
  const dispatch = useAppDispatch();

  const handleSubmit = async () => {
    try {
      await dispatch(updateSubCategory({ id: subCategory.id, name, categoryId }));
      Swal.fire("Success", "Subcategory updated successfully", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to update subcategory", "error");
    }
  };

  return (
    <div>
      <h3>Edit SubCategory</h3>
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
      <button onClick={handleSubmit}>Update</button>
    </div>
  );
};

export default EditSubCategoryModal;