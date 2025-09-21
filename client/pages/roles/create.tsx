import React, { useState } from "react";
import Swal from "sweetalert2";
import { createRole } from "@/store/slices/roleSlice";
import { useAppDispatch } from "@/store/store";
import Layout from "@/components/Layouts/Layout";
import ProtectedRoute from "@/components/protectedRoute";;
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

const CreateRoleModal = () => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState<string>("");

  const handleCreateRole = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await dispatch(createRole({ name })).unwrap();
      Toast.fire({
        icon: "success",
        title: "Role created successfully",
      });
      if (response.id) {
        void router.push(`/roles`); // Redirect to the new role page
      }
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Failed to create role",
      });
    }
  };

  return (
    <Layout>
      <div className="container">
        <div className="row justify-content-center py-5 vh-100">
          <div className="col-lg-9 col-md-12 mb-4">
            <form onSubmit={handleCreateRole} className="mt-5">
              <h1 className="mb-4">Create Role</h1>
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
                Create
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default function ProtectedCreateRoleModal() {
  return (
    <ProtectedRoute>
      <CreateRoleModal />
    </ProtectedRoute>
  );
}