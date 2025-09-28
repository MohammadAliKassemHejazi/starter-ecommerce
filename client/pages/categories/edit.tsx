import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { updateCategory } from "@/store/slices/categorySlice";
import { useAppDispatch } from "@/store/store";
import { FormPage } from "@/components/UI/PageComponents";
import { usePageData } from "@/hooks/usePageData";
import ProtectedRoute from "@/components/protectedRoute";
import { showToast } from "@/components/UI/PageComponents/ToastConfig";

const EditCategory = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = usePageData();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    if (router.isReady && router.query.category) {
      const category = JSON.parse(router.query.category as string);
      setName(category.name || "");
      setDescription(category.description || "");
    }
  }, [router.isReady, router.query]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await dispatch(updateCategory({ id: router.query.id as string, name, description }));
      showToast.success("Category updated successfully");
      router.push("/categories");
    } catch (error) {
      showToast.error("Failed to update category");
    }
  };

  const formFields = [
    {
      type: "text" as const,
      name: "name",
      label: "Name",
      value: name,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setName(e.target.value),
      placeholder: "Enter category name",
      required: true,
      maxLength: 150,
      helpText: "Input your category name here."
    },
    {
      type: "textarea" as const,
      name: "description",
      label: "Description",
      value: description,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setDescription(e.target.value),
      placeholder: "Input your category description here.",
      rows: 4,
      helpText: "Input your category description here."
    }
  ];

  const formActions = [
    {
      type: "button" as const,
      variant: "secondary" as const,
      label: "Cancel",
      href: "/categories"
    },
    {
      type: "submit" as const,
      variant: "primary" as const,
      label: "Update"
    }
  ];

  return (
    <FormPage
      title="Edit Category"
      subtitle="Update category information"
      formFields={formFields}
      formActions={formActions}
      onSubmit={handleSubmit}
      protected={true}
    />
  );
};

export default function ProtectedEditCategory() {
  return (
    <ProtectedRoute>
      <EditCategory />
    </ProtectedRoute>
  );
}