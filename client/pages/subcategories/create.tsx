import React, { useState } from "react";
import { createSubCategory } from "@/store/slices/subCategorySlice";
import { useAppDispatch } from "@/store/store";
import { categoriesSelector } from "@/store/slices/categorySlice";
import { FormPage } from "@/components/UI/PageComponents";
import { usePageData } from "@/hooks/usePageData";
import ProtectedRoute from "@/components/protectedRoute";
import { useSelector } from "react-redux";
import router from "next/router";
import { showToast } from "@/components/UI/PageComponents/ToastConfig";

const CreateSubCategoryModal = () => {
  const dispatch = useAppDispatch();
  const categories = useSelector(categoriesSelector);
  const { isAuthenticated } = usePageData();

  const [name, setName] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");

  const handleCreateSubCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await dispatch(createSubCategory({ name, categoryId })).unwrap();
      showToast.success("Subcategory created successfully");
      if (response.id) {
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
      href: "/subcategories"
    }
  ];

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