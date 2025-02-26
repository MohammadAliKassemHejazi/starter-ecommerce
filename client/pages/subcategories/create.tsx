import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { createSubCategory } from "@/store/slices/subCategorySlice";
import { useAppDispatch } from "@/store/store";
import { categoriesSelector } from "@/store/slices/categorySlice";
import Layout from "@/components/Layouts/Layout";
import protectedRoute from "@/components/protectedRoute";
import Link from "next/link";
import { useSelector } from "react-redux";
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

const CreateSubCategoryModal = () => {
  const dispatch = useAppDispatch();
  const categories = useSelector(categoriesSelector);

  const [name, setName] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");

  const handleCreateSubCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await dispatch(createSubCategory({ name, categoryId })).unwrap();
      Toast.fire({
        icon: "success",
        title: "Subcategory created successfully",
      });
      if (response.id) {
        void router.push(`/subcategories`); // Redirect to the new subcategory page
      }
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Failed to create subcategory",
      });
    }
  };

  return (
    <Layout>
      <div className="container">
        <div className="row justify-content-center py-5 vh-100">
          <div className="col-lg-9 col-md-12 mb-4">
            <form onSubmit={handleCreateSubCategory} className="mt-5">
              <h1 className="mb-4">Create Subcategory</h1>

              {/* Name Field */}
              <div className="form-group">
                <label htmlFor="InputSubCategoryName" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={150}
                  className="form-control"
                  id="InputSubCategoryName"
                  placeholder="Enter subcategory name"
                  required
                />
                <small id="subcategoryNameHelp" className="form-text text-muted">
                  Input your subcategory name here.
                </small>
              </div>

              {/* Category Dropdown */}
              <div className="form-group">
                <label htmlFor="InputCategory" className="form-label">
                  Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="form-select"
                  id="InputCategory"
                  required
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  {categories?.map((category: any) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <small id="categoryHelp" className="form-text text-muted">
                  Select the category for this subcategory.
                </small>
              </div>

              {/* Buttons */}
              <Link href="/subcategories">
                <button type="button" className="btn btn-secondary mt-3 me-3">
                  Cancel
                </button>
              </Link>
              <button type="submit" className="btn btn-primary mt-3">
                Create
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default protectedRoute(CreateSubCategoryModal);