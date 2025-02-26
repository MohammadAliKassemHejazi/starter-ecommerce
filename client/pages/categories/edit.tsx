import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import { updateCategory } from "@/store/slices/categorySlice";
import { useAppDispatch } from "@/store/store";
import Layout from "@/components/Layouts/Layout";
import protectedRoute from "@/components/protectedRoute";
import Link from "next/link";

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

const EditCategory = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    if (router.isReady && router.query.category) {
      const category = JSON.parse(router.query.category as string); // Parse the category object
      setName(category.name || "");
      setDescription(category.description || "");
    }
  }, [router.isReady, router.query]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await dispatch(updateCategory({ id: router.query.id as string, name, description }));
      Toast.fire({
        icon: "success",
        title: "Category updated successfully",
      });
      router.push("/categories"); // Redirect to categories list
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Failed to update category",
      });
    }
  };

  return (
    <Layout>
      <div className="container">
        <div className="row justify-content-center py-5 vh-100">
          <div className="col-lg-9 col-md-12 mb-4">
            <form onSubmit={handleSubmit} className="mt-5">
              <h1 className="mb-4">Edit Category</h1>
              <div className="form-group">
                <label htmlFor="InputCategoryName" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={150}
                  className="form-control"
                  id="InputCategoryName"
                  placeholder="Enter category name"
                  required
                />
                <small id="categoryNameHelp" className="form-text text-muted">
                  Input your category name here.
                </small>
              </div>
              <div className="form-group">
                <label htmlFor="InputCategoryDescription" className="form-label">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="form-control"
                  id="InputCategoryDescription"
                  placeholder="Input your category description here."
                />
                <small id="categoryDescriptionHelp" className="form-text text-muted">
                  Input your category description here.
                </small>
              </div>
              <Link href="/categories">
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

export default protectedRoute(EditCategory);