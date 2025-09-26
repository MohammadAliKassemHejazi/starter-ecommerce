import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { updateSubCategory } from "@/store/slices/subCategorySlice";
import { useAppDispatch } from "@/store/store";
import { categoriesSelector } from "@/store/slices/categorySlice";
import { FormPage } from "@/components/UI/PageComponents";
import { usePageData } from "@/hooks/usePageData";
import ProtectedRoute from "@/components/protectedRoute";
import { useSelector } from "react-redux";
import { showToast } from "@/components/UI/PageComponents/ToastConfig";

const EditSubCategoryModal = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const categories = useSelector(categoriesSelector);
  const { isAuthenticated } = usePageData();

  const [name, setName] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");

  useEffect(() => {
    if (router.isReady && router.query.subCategory) {
      const subCategory = JSON.parse(router.query.subCategory as string);
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
      href: "/subcategories"
    }
  ];

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