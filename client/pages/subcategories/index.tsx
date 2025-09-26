import React from "react";
import { useSelector } from "react-redux";
import {
  fetchSubCategories,
  deleteSubCategory,
  subCategoriesSelector,
} from "@/store/slices/subCategorySlice";
import { useAppDispatch } from "@/store/store";
import { TablePage } from "@/components/UI/PageComponents";
import { usePageData } from "@/hooks/usePageData";
import ProtectedRoute from "@/components/protectedRoute";
import router from "next/router";

const SubCategoriesGrid = () => {
  const dispatch = useAppDispatch();
  const subCategories = useSelector(subCategoriesSelector);
  const { isAuthenticated } = usePageData();

  React.useEffect(() => {
    dispatch(fetchSubCategories());
  }, [dispatch]);

  const handleDeleteSubCategory = async (id: string) => {
    await dispatch(deleteSubCategory(id));
  };

  const handleEditSubCategory = (subCategory: any) => {
    router.push({
      pathname: '/subcategories/edit',
      query: { subcategory: JSON.stringify(subCategory) }
    });
  };

  // Table columns for subcategories
  const subCategoryColumns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value: string) => <span className="fw-semibold">{value}</span>
    },
    {
      key: 'category',
      label: 'Category',
      render: (value: any) => value?.name || "N/A"
    }
  ];

  return (
    <TablePage
      title="Subcategories"
      subtitle="Manage product subcategories"
      data={subCategories || []}
      columns={subCategoryColumns}
      searchPlaceholder="Search subcategories..."
      emptyMessage="No subcategories found. Create your first subcategory to get started!"
      addButton={{ href: '/subcategories/create', label: 'New Subcategory' }}
      editPath="/subcategories/edit"
      deleteAction={handleDeleteSubCategory}
      exportButton={{ onClick: () => console.log('Export subcategories') }}
      filterButton={{ onClick: () => console.log('Filter subcategories') }}
      customActions={[
        {
          key: 'edit',
          label: 'Edit',
          icon: 'bi bi-pencil',
          variant: 'primary',
          onClick: handleEditSubCategory
        },
        {
          key: 'delete',
          label: 'Delete',
          icon: 'bi bi-trash',
          variant: 'danger',
          onClick: (subCategory) => handleDeleteSubCategory(subCategory.id)
        }
      ]}
      headerActions={
        <div className="d-flex align-items-center gap-3">
          <span className="text-muted">
            Total Subcategories: {subCategories?.length || 0}
          </span>
          <button 
            className="btn btn-primary"
            onClick={() => router.push('/subcategories/create')}
          >
            New Subcategory
          </button>
        </div>
      }
    />
  );
};

export default function ProtectedSubCategoriesGrid() {
  return (
    <ProtectedRoute>
      <SubCategoriesGrid />
    </ProtectedRoute>
  );
}