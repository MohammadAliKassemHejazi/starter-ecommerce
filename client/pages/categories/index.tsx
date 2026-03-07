import React, { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchCategories, deleteCategory, categoriesSelector } from "@/store/slices/categorySlice";
import { useAppDispatch } from "@/store/store";
import { CategoryTablePreset } from "@/components/UI/ModernTable";
import { TablePage } from "@/components/UI/PageComponents";
import { usePageData } from "@/hooks/usePageData";
import { useTranslation } from 'react-i18next';
import { usePermissions } from "@/hooks/usePermissions";
import SubscriptionGate from "@/components/SubscriptionGate";
import ConfirmationModal from "@/components/UI/ConfirmationModal";
import router from "next/router";

const CategoriesGrid = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const categories = useSelector(categoriesSelector);
  const { isAdmin ,isSuperAdmin } = usePermissions();
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
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);
  
  useEffect(() => {
    fetchCategoriesData();

  }, [fetchCategoriesData]);

  const handleDeleteCategory = (category: any) => {
    setDeleteModal({ show: true, category });
  };

  const confirmDelete = async () => {
    if (!deleteModal.category) {return;}

    try {
      await dispatch(deleteCategory(deleteModal.category.id));
    } catch (error) {
      console.error('Failed to delete category:', error);
    } finally {
      setDeleteModal({ show: false, category: null });
    }
  };



  const handleEditAction = (category: any) => {
 
    console.log(category, 'Editing category...');
    router.push({
      pathname: "/categories/edit",
      query: { category: JSON.stringify(category) }
    });
  };

  // Stats cards for admin
  const statsCards = isAdmin ? (
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
  ) : null;

  return (
    <>
      {statsCards}
      
      <TablePage
        title={isAdmin ? t('categories.categories') : 'Browse Categories'}
        subtitle={isAdmin 
          ? 'Manage your product categories and organize your inventory'
          : 'Explore our product categories to find what you\'re looking for'
        }
        data={categories || []}
        columns={CategoryTablePreset.columns}
        loading={loading}
        searchPlaceholder="Search categories..."
        emptyMessage="No categories found. Create your first category to get started!"
        addButton={{
          href: '/categories/create',
          label: t('categories.createCategory')
        }}
        exportButton={{ onClick: () => console.log('Export categories') }}
        filterButton={{ onClick: () => console.log('Filter categories') }}
        customActions={[
          {
            key: 'edit',
            label: 'Edit',
            icon: 'bi bi-pencil',
            variant: 'primary',
            onClick: (row)=> handleEditAction(row),
            show: () => isAdmin ||isSuperAdmin
          },
          {
            key: 'delete',
            label: 'Delete',
            icon: 'bi bi-trash',
            variant: 'danger',
            onClick: (row) => handleDeleteCategory(row),
            show: () => isAdmin ||isSuperAdmin
          }
        ]}
        headerActions={
          <SubscriptionGate requireSubscription={true}>
            <button 
              className="btn btn-primary d-flex align-items-center"
              onClick={() => router.push('/categories/create')}
            >
              <i className="bi bi-plus-circle me-2"></i>
              {t('categories.createCategory')}
            </button>
          </SubscriptionGate>
        }
      />

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
    </>
  );
};

export default CategoriesGrid;