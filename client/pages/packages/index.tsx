import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layouts/Layout';
import ProtectedRoute from "@/components/protectedRoute";;
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

interface Package {
  id: string;
  name: string;
  description?: string;
  storeLimit: number;
  categoryLimit: number;
  createdAt: string;
  updatedAt: string;
}

const PackagesPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/packages');
      if (response.ok) {
        const data = await response.json();
        setPackages(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
      Toast.fire({
        icon: 'error',
        title: 'Failed to load packages',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePackage = async (id: string) => {
    Swal.fire({
      title: 'Delete Package',
      text: 'Are you sure you want to delete this package?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`/api/packages/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            setPackages(packages.filter(pkg => pkg.id !== id));
            Toast.fire({
              icon: 'success',
              title: 'Package deleted successfully',
            });
          } else {
            throw new Error('Failed to delete package');
          }
        } catch (error) {
          console.error('Error deleting package:', error);
          Toast.fire({
            icon: 'error',
            title: 'Failed to delete package',
          });
        }
      }
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mt-5">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-12">
            <h1 className="mb-4 text-center fw-bold">Packages</h1>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <span className="text-muted">
                Total Packages: {packages.length}
              </span>
              <button 
                className="btn btn-primary"
                onClick={() => router.push('/packages/create')}
              >
                New Package
              </button>
            </div>
            
            <div className="table-responsive shadow-sm bg-white">
              <table className="table table-hover table-bordered border-secondary">
                <thead className="bg-dark text-light text-center">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Description</th>
                    <th scope="col">Store Limit</th>
                    <th scope="col">Category Limit</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map((pkg, idx) => (
                    <tr key={pkg.id} className="align-middle text-center">
                      <td>{idx + 1}</td>
                      <td className="fw-semibold">{pkg.name}</td>
                      <td className="text-truncate" style={{ maxWidth: "200px" }}>
                        {pkg.description || "N/A"}
                      </td>
                      <td>{pkg.storeLimit}</td>
                      <td>{pkg.categoryLimit}</td>
                      <td>
                        <div className="btn-group">
                          <button 
                            className="btn btn-primary btn-sm me-2"
                            onClick={() => router.push({
                              pathname: '/packages/edit',
                              query: { package: JSON.stringify(pkg) }
                            })}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeletePackage(pkg.id)}
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

            {packages.length === 0 && (
              <div className="text-center py-5">
                <h3 className="text-muted">No packages found</h3>
                <p className="text-muted">Create your first package to get started!</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => router.push('/packages/create')}
                >
                  Create Package
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default function ProtectedPackagesPage() {
  return (
    <ProtectedRoute>
      <PackagesPage />
    </ProtectedRoute>
  );
}
