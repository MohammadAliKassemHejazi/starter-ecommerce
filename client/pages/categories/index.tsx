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
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <h1 className="mb-4 text-center fw-bold">Categories</h1>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <span className="text-muted">
                Total Categories: {categories?.length || 0}
              </span>
              {/* Add a button to create a new category */}
              <button className="btn btn-primary">New Category</button>
            </div>
            <div className="table-responsive shadow-sm bg-white">
              <table className="table table-hover table-bordered border-secondary">
                <thead className="bg-dark text-light text-center">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Description</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories?.map((category: any, idx: number) => (
                    <tr key={category.id} className="align-middle text-center">
                      <td>{idx + 1}</td>
                      <td className="fw-semibold">{category.name}</td>
                      <td className="text-truncate" style={{ maxWidth: "200px" }}>
                        {category.description || "N/A"}
                      </td>
                      <td>
                        <div className="btn-group">
                          <button className="btn btn-primary btn-sm me-2">Edit</button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default protectedRoute(CategoriesGrid);