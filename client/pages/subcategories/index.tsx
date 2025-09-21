import Layout from "@/components/Layouts/Layout";
import ProtectedRoute from "@/components/protectedRoute";;
import {
  fetchSubCategories,
  deleteSubCategory,
  subCategoriesSelector,
} from "@/store/slices/subCategorySlice";
import { useAppDispatch } from "@/store/store";
import React from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import router from "next/router";

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
      html: `
        <p><strong>ID:</strong> ${id}</p>
      `,
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
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <h1 className="mb-4 text-center fw-bold">Subcategories</h1>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <span className="text-muted">
                Total Subcategories: {subCategories?.length || 0}
              </span>
              <button 
                className="btn btn-primary"
                onClick={() => router.push('/subcategories/create')}
              >
                New Subcategory
              </button>
            </div>
            <div className="table-responsive shadow-sm bg-white">
              <table className="table table-hover table-bordered border-secondary">
                <thead className="bg-dark text-light text-center">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Category</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subCategories?.map((subCategory: any, idx: number) => (
                    <tr key={subCategory.id} className="align-middle text-center">
                      <td>{idx + 1}</td>
                      <td className="fw-semibold">{subCategory.name}</td>
                      <td>{subCategory.category?.name || "N/A"}</td>
                      <td>
                        <div className="btn-group">
                          <button 
                            className="btn btn-primary btn-sm me-2"
                            onClick={() => router.push({
                              pathname: '/subcategories/edit',
                              query: { subcategory: JSON.stringify(subCategory) }
                            })}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteSubCategory(subCategory.id)}
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

export default function ProtectedSubCategoriesGrid() {
  return (
    <ProtectedRoute>
      <SubCategoriesGrid />
    </ProtectedRoute>
  );
}