import React, { useCallback, useEffect, useState } from "react";
import { createSubCategory } from "@/store/slices/subCategorySlice";
import { useAppDispatch } from "@/store/store";
import { categoriesSelector, fetchCategories } from "@/store/slices/categorySlice";
import { FormPage } from "@/components/UI/PageComponents";
import { usePageData } from "@/hooks/usePageData";
import ProtectedRoute from "@/components/protectedRoute";
import { useSelector } from "react-redux";
import router from "next/router";
import { showToast } from "@/components/UI/PageComponents/ToastConfig";
import { useTranslation } from "react-i18next";
import { on } from "events";

const CreateSubCategoryModal = () => {
    const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const categories = useSelector(categoriesSelector);
  const { isAuthenticated } = usePageData();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");

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
  const handleCreateSubCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await dispatch(createSubCategory({ name, categoryId })).unwrap();
      console.log('Subcategory created:', response);
      showToast.success("Subcategory created successfully");
      if (response.data.id) {
        void router.push(`/subcategories`);
      }
    } catch (error) {
      showToast.error("Failed to create subcategory");
    }
  };

  const formFields = [
    {
      type: "text" as const,
      name: "name",
      label: "Name",
      value: name,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setName(e.target.value),
      placeholder: "Enter subcategory name",
      required: true,
      maxLength: 150,
      helpText: "Input your subcategory name here."
    },
    {
      type: "select" as const,
      name: "categoryId",
      label: "Category",
      value: categoryId,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setCategoryId(e.target.value),
      required: true,
      options: [
        { value: "", label: "Select Category", disabled: true },
        ...(categories?.map((category: any) => ({
          value: category.id,
          label: category.name
        })) || [])
      ],
      helpText: "Select the category for this subcategory."
    }
  ];

  const formActions = [
    {
      type: "button" as const,
      variant: "secondary" as const,
      label: "Cancel",
      href: "/subcategories",
      onClick: () => { void router.push("/subcategories"); }
    }
  ];
  if (loading) {
    return (
      <FormPage
        title={t('categories.createCategory')}
        subtitle="Add a new category to organize your products"
        loading={true}
        protected={true}
      />
    );
  }
  return (
    <FormPage
      title="Create Subcategory"
      subtitle="Add a new subcategory to organize your products"
      formFields={formFields}
      formActions={formActions}
      onSubmit={handleCreateSubCategory}
      protected={true}
    />
  );
};

export default function ProtectedCreateSubCategoryModal() {
  return (
    <ProtectedRoute>
      <CreateSubCategoryModal />
    </ProtectedRoute>
  );
}