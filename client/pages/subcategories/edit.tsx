import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { updateSubCategory } from "@/store/slices/subCategorySlice";
import { useAppDispatch } from "@/store/store";
import { categoriesSelector, fetchCategories } from "@/store/slices/categorySlice";
import { FormPage } from "@/components/UI/PageComponents";
import ProtectedRoute from "@/components/protectedRoute";
import { useSelector } from "react-redux";
import { showToast } from "@/components/UI/PageComponents/ToastConfig";
import { useTranslation } from "react-i18next";
import { on } from "events";

  
const EditSubCategoryModal = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const categories = useSelector(categoriesSelector);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
     const { t } = useTranslation();
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
  useEffect(() => {
    if (router.isReady && router.query.subcategory) {
      const subCategory = JSON.parse(router.query.subcategory as string);
      console.log('Editing subcategory:', subCategory);
      setName(subCategory.name || "");
      setCategoryId(subCategory.categoryId || "");
    }
  }, [router.isReady, router.query]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await dispatch(updateSubCategory({ id: router.query.id as string, name, categoryId }));
      showToast.success("Subcategory updated successfully");
      router.push("/subcategories");
    } catch (error) {
      showToast.error("Failed to update subcategory");
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
      onClick: () => { void router.push("/subcategories") }
    }
  ];
  if (loading) {
    return (
      <FormPage
        title={t('subCategory.createsubCategory')}
        subtitle="Add a new category to organize your products"
        loading={true}
        protected={true}
      />
    );
  }
  return (
    <FormPage
      title="Edit Subcategory"
      subtitle="Update subcategory information"
      formFields={formFields}
      formActions={formActions}
      onSubmit={handleSubmit}
      protected={true}
    />
  );
};

export default function ProtectedEditSubCategoryModal() {
  return (
    <ProtectedRoute>
      <EditSubCategoryModal />
    </ProtectedRoute>
  );
}