// @/pages/subcategories/index.tsx
import Layout from "@/components/Layouts/Layout";
import protectedRoute from "@/components/protectedRoute";
import { fetchSubCategories, deleteSubCategory, subCategoriesSelector } from "@/store/slices/subCategorySlice";
import { useAppDispatch } from "@/store/store";
import React from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

const SubCategoriesGrid = () => {
  const dispatch = useAppDispatch();
  const subCategories = useSelector(subCategoriesSelector);

  React.useEffect(() => {
    dispatch(fetchSubCategories());
  }, [dispatch]);

  const handleDeleteSubCategory = async (id: string) => {
    Swal.fire({
      title: "Do you want to delete this subcategory?",
      html: `id: ${id}`,
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await dispatch(deleteSubCategory(id));
          Toast.fire({
            icon: "success",
            title: "Subcategory deleted successfully",
          });
        } catch (error) {
          Toast.fire({
            icon: "error",
            title: "Failed to delete subcategory",
          });
        }
      }
    });
  };

  return (
    <Layout>
      <h2>SubCategories</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {subCategories?.map((subCategory: any) => (
            <tr key={subCategory.id}>
              <td>{subCategory.id}</td>
              <td>{subCategory.name}</td>
              <td>{subCategory.category?.name || "N/A"}</td>
              <td>
                <button>Edit</button>
                <button onClick={() => handleDeleteSubCategory(subCategory.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default protectedRoute(SubCategoriesGrid);