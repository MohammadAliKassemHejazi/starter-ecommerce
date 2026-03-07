import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import { updateRole } from "@/store/slices/roleSlice";
import { useAppDispatch } from "@/store/store";
import Layout from "@/components/Layouts/Layout";
import ProtectedRoute from "@/components/protectedRoute";
import Link from "next/link";
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

const EditRoleModal = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [name, setName] = useState<string>("");
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (router.isReady && router.query.role) {
      const role = JSON.parse(router.query.role as string); // Parse the role object
      setName(role.name || "");
    }
    loadUserPackage();
  }, [router.isReady, router.query]);

  const loadUserPackage = async () => {
    try {
      const packageData = await getUserActivePackage();
      setIsSuperAdmin((packageData as any)?.Package?.isSuperAdminPackage || false);
    } catch (error) {
      console.error('Error loading user package:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!isSuperAdmin) {
      Toast.fire({
        icon: "error",
        title: "Only super admins can update roles",
      });
      return;
    }

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
                <p>Only super admins can edit roles.</p>
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
            <form onSubmit={handleSubmit} className="mt-5">
              <h1 className="mb-4">Edit Role</h1>
              <div className="alert alert-info">
                <h5>Super Admin Access</h5>
                <p>You have super admin privileges to edit roles for your organization.</p>
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
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default function ProtectedEditRoleModal() {
  return (
    <ProtectedRoute>
      <EditRoleModal />
    </ProtectedRoute>
  );
}