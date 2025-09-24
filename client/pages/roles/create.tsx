import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { createRole } from "@/store/slices/roleSlice";
import { useAppDispatch } from "@/store/store";
import Layout from "@/components/Layouts/Layout";
import ProtectedRoute from "@/components/protectedRoute";
import Link from "next/link";
import router from "next/router";
import { getUserActivePackage } from "@/services/packageService";

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
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserPackage();
  }, []);

  const loadUserPackage = async () => {
    try {
      const packageData = await getUserActivePackage();
      setIsSuperAdmin(packageData?.Package?.isSuperAdminPackage || false);
    } catch (error) {
      console.error('Error loading user package:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!isSuperAdmin) {
      Toast.fire({
        icon: "error",
        title: "Only super admins can create roles",
      });
      return;
    }

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

  if (loading) {
    return (
      <Layout>
        <div className="container">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isSuperAdmin) {
    return (
      <Layout>
        <div className="container">
          <div className="row justify-content-center py-5 vh-100">
            <div className="col-lg-9 col-md-12 mb-4">
              <div className="alert alert-warning">
                <h4>Access Denied</h4>
                <p>Only super admins can create roles.</p>
                <p>Please contact your administrator or upgrade your package.</p>
              </div>
              <Link href="/roles">
                <button type="button" className="btn btn-secondary mt-3">
                  Back to Roles
                </button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container">
        <div className="row justify-content-center py-5 vh-100">
          <div className="col-lg-9 col-md-12 mb-4">
            <form onSubmit={handleCreateRole} className="mt-5">
              <h1 className="mb-4">Create Role</h1>
              <div className="alert alert-info">
                <h5>Super Admin Access</h5>
                <p>You have super admin privileges to create roles for your organization.</p>
              </div>
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