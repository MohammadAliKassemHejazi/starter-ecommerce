import React, { useState } from "react";
import { createPermission } from "@/store/slices/permissionSlice";
import { useAppDispatch } from "@/store/store";
import { FormPage } from "@/components/UI/PageComponents";
import { usePageData } from "@/hooks/usePageData";
import ProtectedRoute from "@/components/protectedRoute";
import router from "next/router";
import { showToast } from "@/components/UI/PageComponents/ToastConfig";

const CreatePermissionModal = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = usePageData();
  const [name, setName] = useState<string>("");

  const handleCreatePermission = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await dispatch(createPermission({ name })).unwrap();
      showToast.success("Permission created successfully");
      if (response.id) {
        void router.push(`/permissions`);
      }
    } catch (error) {
      showToast.error("Failed to create permission");
    }
  };

  const formFields = [
    {
      type: "text",
      name: "name",
      label: "Name",
      value: name,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value),
      placeholder: "Enter permission name",
      required: true,
      maxLength: 150,
      helpText: "Input your permission name here."
    }
  ];

  const formActions = [
    {
      type: "button" as const,
      variant: "secondary" as const,
      label: "Cancel",
      href: "/permissions"
    },
    {
      type: "submit" as const,
      variant: "primary" as const,
      label: "Create"
    }
  ];

  return (
    <FormPage
      title="Create Permission"
      subtitle="Add a new permission to the system"
      formFields={formFields}
      formActions={formActions}
      onSubmit={handleCreatePermission}
      protected={true}
    />
  );
};

export default function ProtectedCreatePermissionModal() {
  return (
    <ProtectedRoute>
      <CreatePermissionModal />
    </ProtectedRoute>
  );
}