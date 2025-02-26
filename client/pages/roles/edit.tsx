import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import { updateRole } from "@/store/slices/roleSlice";
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

const EditRoleModal = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [name, setName] = useState<string>("");

  useEffect(() => {
    if (router.isReady && router.query.role) {
      const role = JSON.parse(router.query.role as string); // Parse the role object
      setName(role.name || "");
    }
  }, [router.isReady, router.query]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await dispatch(updateRole({ id: router.query.id as string, name }));
      Toast.fire({
        icon: "success",
        title: "Role updated successfully",
      });
      router.push("/roles"); // Redirect to roles list
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Failed to update role",
      });
    }
  };

  return (
    <Layout>
      <div className="container">
        <div className="row justify-content-center py-5 vh-100">
          <div className="col-lg-9 col-md-12 mb-4">
            <form onSubmit={handleSubmit} className="mt-5">
              <h1 className="mb-4">Edit Role</h1>
              <div className="form-group">
                <label htmlFor="InputRoleName" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={150}
                  className="form-control"
                  id="InputRoleName"
                  placeholder="Enter role name"
                  required
                />
                <small id="roleNameHelp" className="form-text text-muted">
                  Input your role name here.
                </small>
              </div>
              <Link href="/roles">
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

export default protectedRoute(EditRoleModal);