import React, { useState } from "react";
import Swal from "sweetalert2";
import { createPermission } from "@/store/slices/permissionSlice";
import { useAppDispatch } from "@/store/store";
import Layout from "@/components/Layouts/Layout";
import protectedRoute from "@/components/protectedRoute";
import Link from "next/link";
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

const CreatePermissionModal = () => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState<string>("");

  const handleCreatePermission = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await dispatch(createPermission({ name })).unwrap();
      Toast.fire({
        icon: "success",
        title: "Permission created successfully",
      });
      if (response.id) {
        void router.push(`/permissions`); // Redirect to the new permission page
      }
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Failed to create permission",
      });
    }
  };

  return (
    <Layout>
      <div className="container">
        <div className="row justify-content-center py-5 vh-100">
          <div className="col-lg-9 col-md-12 mb-4">
            <form onSubmit={handleCreatePermission} className="mt-5">
              <h1 className="mb-4">Create Permission</h1>
              <div className="form-group">
                <label htmlFor="InputPermissionName" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={150}
                  className="form-control"
                  id="InputPermissionName"
                  placeholder="Enter permission name"
                  required
                />
                <small id="permissionNameHelp" className="form-text text-muted">
                  Input your permission name here.
                </small>
              </div>
              <Link href="/permissions">
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

export default protectedRoute(CreatePermissionModal);