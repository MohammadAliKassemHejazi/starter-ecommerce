import Layout from "@/components/Layouts/Layout";
import { fetchCategories, deleteCategory, categoriesSelector } from "@/store/slices/categorySlice";
import { useAppDispatch } from "@/store/store";
import router from "next/router";
import React, { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import DataTable from "@/components/UI/DataTable";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import ConfirmationModal from "@/components/UI/ConfirmationModal";
import { useTranslation } from 'react-i18next';
import { usePermissions } from "@/hooks/usePermissions";

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

const CategoriesGrid = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const categories = useSelector(categoriesSelector);
  const { isAdmin } = usePermissions();
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    show: boolean;
    category: any;
  }>({ show: false, category: null });
  const fetchCategoriesData = useCallback(async () => {
    setLoading(true);
    try {
      await dispatch(fetchCategories());
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Failed to load categories",
      });
    } finally {
      setLoading(false);
    }
  }, [dispatch]);
  
  React.useEffect(() => {
    fetchCategoriesData();
  }, [dispatch, fetchCategoriesData]);



  const handleDeleteCategory = (category: any) => {
    setDeleteModal({ show: true, category });
  };

  const confirmDelete = async () => {
    if (!deleteModal.category) {
      return;
    }

    try {
      await dispatch(deleteCategory(deleteModal.category.id));
      Toast.fire({
        icon: "success",
        title: "Category deleted successfully",
      });
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Failed to delete category",
      });
    } finally {
      setDeleteModal({ show: false, category: null });
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value: string, row: any) => (
        <div>
          <div className="fw-semibold">{value}</div>
          <small className="text-muted">ID: {row.id}</small>
        </div>
      )
    },
    {
      key: 'description',
      label: 'Description',
      render: (value: string) => (
        <div className="text-truncate" style={{ maxWidth: '200px' }}>
          {value || 'No description'}
        </div>
      )
    },
    {
      key: 'createdAt',
      label: 'Created At',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString()
    }
  ];

  const actions = (row: any) => {
    if (!isAdmin()) {
      return null;
    }
    
    return (
      <div className="btn-group" role="group">
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={(e) => {
            e.stopPropagation();
            router.push({
              pathname: "/categories/edit",
              query: { category: JSON.stringify(row) }
            });
          }}
          title="Edit Category"
        >
          <i className="bi bi-pencil"></i>
        </button>
        <button
          className="btn btn-outline-danger btn-sm"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteCategory(row);
          }}
          title="Delete Category"
        >
          <i className="bi bi-trash"></i>
        </button>
      </div>
    );
  };

  return (
    <Layout>
      <div className="container mt-5">
        <div className="row">
          <div className="col-12">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="h2 fw-bold text-dark mb-1">
                  {isAdmin() ? t('categories.categories') : 'Browse Categories'}
                </h1>
                <p className="text-muted mb-0">
                  {isAdmin() 
                    ? 'Manage your product categories and organize your inventory'
                    : 'Explore our product categories to find what you\'re looking for'
                  }
                </p>
              </div>
              {isAdmin() && (
                <button 
                  className="btn btn-primary d-flex align-items-center"
                  onClick={() => router.push('/categories/create')}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  {t('categories.createCategory')}
                </button>
              )}
            </div>

            {/* Stats Cards - Only show for admin */}
            {isAdmin() && (
              <div className="row mb-4">
                <div className="col-md-3">
                  <div className="card bg-primary text-white">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1">
                          <h6 className="card-title mb-0">Total Categories</h6>
                          <h3 className="mb-0">{categories?.length || 0}</h3>
                        </div>
                        <div className="fs-1">
                          <i className="bi bi-tags"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card bg-success text-white">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1">
                          <h6 className="card-title mb-0">Active Categories</h6>
                          <h3 className="mb-0">{categories?.filter((c: any) => c.isActive !== false).length || 0}</h3>
                        </div>
                        <div className="fs-1">
                          <i className="bi bi-check-circle"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Data Table */}
            <div className="card shadow-sm">
              <div className="card-body">
                <DataTable
                  data={categories || []}
                  columns={columns}
                  loading={loading}
                  searchable={true}
                  searchPlaceholder="Search categories..."
                  pagination={true}
                  pageSize={10}
                  actions={actions}
                  emptyMessage="No categories found. Create your first category to get started!"
                  onRowClick={(row) => router.push({
                    pathname: "/categories/edit",
                    query: { category: JSON.stringify(row) }
                  })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        <ConfirmationModal
          show={deleteModal.show}
          onHide={() => setDeleteModal({ show: false, category: null })}
          onConfirm={confirmDelete}
          title="Delete Category"
          message={`Are you sure you want to delete "${deleteModal.category?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
        />
      </div>
    </Layout>
  );
};

export default CategoriesGrid;