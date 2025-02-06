// @/pages/categories/index.tsx
import Layout from "@/components/Layouts/Layout";
import protectedRoute from "@/components/protectedRoute";
import { fetchCategories, deleteCategory, categoriesSelector } from "@/store/slices/categorySlice";
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

const CategoriesGrid = () => {
  const dispatch = useAppDispatch();
  const categories = useSelector(categoriesSelector);

  React.useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleDeleteCategory = async (id: string) => {
    Swal.fire({
      title: "Do you want to delete this category?",
      html: `id: ${id}`,
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await dispatch(deleteCategory(id));
          Toast.fire({
            icon: "success",
            title: "Category deleted successfully",
          });
        } catch (error) {
          Toast.fire({
            icon: "error",
            title: "Failed to delete category",
          });
        }
      }
    });
  };

  return (
    <Layout>
      <h2>Categories</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {categories?.map((category: any) => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>{category.name}</td>
              <td>{category.description || "N/A"}</td>
              <td>
                <button>Edit</button>
                <button onClick={() => handleDeleteCategory(category.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default protectedRoute(CategoriesGrid);