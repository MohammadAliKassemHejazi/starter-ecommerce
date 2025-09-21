import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import { updatePermission } from "@/store/slices/permissionSlice";
import { useAppDispatch } from "@/store/store";
import Layout from "@/components/Layouts/Layout";
import ProtectedRoute from "@/components/protectedRoute";;
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

const EditPermissionModal = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [name, setName] = useState<string>("");

  useEffect(() => {
    if (router.isReady && router.query.permission) {
      const permission = JSON.parse(router.query.permission as string); // Parse the permission object
      setName(permission.name || "");
    }
  }, [router.isReady, router.query]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await dispatch(updatePermission({ id: router.query.id as string, name }));
      Toast.fire({
        icon: "success",
        title: "Permission updated successfully",
      });
      router.push("/permissions"); // Redirect to permissions list
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Failed to update permission",
      });
    }
  };

  return (
    <Layout>
      <div className="container">
        <div className="row justify-content-center py-5 vh-100">
          <div className="col-lg-9 col-md-12 mb-4">
            <form onSubmit={handleSubmit} className="mt-5">
              <h1 className="mb-4">Edit Permission</h1>
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
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default function ProtectedEditPermissionModal() {
  return (
    <ProtectedRoute>
      <EditPermissionModal />
    </ProtectedRoute>
  );
}