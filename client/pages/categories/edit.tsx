import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { updateCategory } from "@/store/slices/categorySlice";
import { useAppDispatch } from "@/store/store";
import { FormPage } from "@/components/UI/PageComponents";
import ProtectedRoute from "@/components/protectedRoute";
import { showToast } from "@/components/UI/PageComponents/ToastConfig";

const EditCategory = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    
    if (router.isReady && router.query.category) {
      const category = JSON.parse(router.query.category as string);
      setName(category.name || "");
      setDescription(category.description || "");
    }
  }, [router.isReady, router.query]);
 const handleCancel = () => {
      router.push("/categories");
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
     
       const category = JSON.parse(router.query.category as string);
  
      await dispatch(updateCategory({ id: category.id as string, name, description }));
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
      onClick: handleCancel 
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