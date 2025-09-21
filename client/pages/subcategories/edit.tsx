import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import { updateSubCategory } from "@/store/slices/subCategorySlice";
import { useAppDispatch } from "@/store/store";
import { categoriesSelector } from "@/store/slices/categorySlice";
import Layout from "@/components/Layouts/Layout";
import ProtectedRoute from "@/components/protectedRoute";;
import Link from "next/link";
import { useSelector } from "react-redux";

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

const EditSubCategoryModal = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const categories = useSelector(categoriesSelector);

  const [name, setName] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");

  useEffect(() => {
    if (router.isReady && router.query.subCategory) {
      const subCategory = JSON.parse(router.query.subCategory as string); // Parse the subcategory object
      setName(subCategory.name || "");
      setCategoryId(subCategory.categoryId || "");
    }
  }, [router.isReady, router.query]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await dispatch(updateSubCategory({ id: router.query.id as string, name, categoryId }));
      Toast.fire({
        icon: "success",
        title: "Subcategory updated successfully",
      });
      router.push("/subcategories"); // Redirect to subcategories list
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Failed to update subcategory",
      });
    }
  };

  return (
    <Layout>
      <div className="container">
        <div className="row justify-content-center py-5 vh-100">
          <div className="col-lg-9 col-md-12 mb-4">
            <form onSubmit={handleSubmit} className="mt-5">
              <h1 className="mb-4">Edit Subcategory</h1>

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
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default function ProtectedEditSubCategoryModal() {
  return (
    <ProtectedRoute>
      <EditSubCategoryModal />
    </ProtectedRoute>
  );
}