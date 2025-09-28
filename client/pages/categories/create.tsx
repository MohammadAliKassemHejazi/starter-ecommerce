import React, { useState } from "react";
import { createCategory } from "@/store/slices/categorySlice";
import { useAppDispatch } from "@/store/store";
import { FormPage } from "@/components/UI/PageComponents";
import { usePageData } from "@/hooks/usePageData";
import ProtectedRoute from "@/components/protectedRoute";
import router from "next/router";
import { showToast } from "@/components/UI/PageComponents/ToastConfig";
import { useTranslation } from 'react-i18next';
import { validateForm, commonRules } from '@/utils/validation';

const CreateCategory = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = usePageData();
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const validationRules = {
    name: { ...commonRules.required, minLength: 2, maxLength: 100 },
    description: { maxLength: 500 }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCreateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateForm(formData, validationRules);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await dispatch(createCategory(formData)).unwrap();
      showToast.success("Category created successfully");
      void router.push(`/categories`);
    } catch (error) {
      showToast.error("Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  const formFields = [
    {
      type: "text" as const,
      name: "name",
      label: "Category Name",
      value: formData.name,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => handleInputChange('name', e.target.value),
      placeholder: "Enter category name",
      required: true,
      validation: validationRules.name,
      error: errors.name
    },
    {
      type: "textarea" as const,
      name: "description",
      label: "Description",
      value: formData.description,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => handleInputChange('description', e.target.value),
      placeholder: "Enter category description (optional)",
      rows: 4,
      validation: validationRules.description,
      error: errors.description
    }
  ];

  const formActions = [
    {
      type: "button" as const,
      variant: "outline-secondary" as const,
      label: "Cancel",
      href: "/categories"
    },
    {
      type: "submit" as const,
      variant: "primary" as const,
      label: loading ? "Creating..." : "Create Category",
      disabled: loading
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
      title={t('categories.createCategory')}
      subtitle="Add a new category to organize your products"
      formFields={formFields}
      formActions={formActions}
      onSubmit={handleCreateCategory}
      protected={true}
    />
  );
};

export default function ProtectedCreateCategory() {
  return (
    <ProtectedRoute>
      <CreateCategory />
    </ProtectedRoute>
  );
}