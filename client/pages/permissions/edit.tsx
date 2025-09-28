import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { updatePermission } from "@/store/slices/permissionSlice";
import { useAppDispatch } from "@/store/store";
import { FormPage } from "@/components/UI/PageComponents";
import { usePageData } from "@/hooks/usePageData";
import ProtectedRoute from "@/components/protectedRoute";
import { showToast } from "@/components/UI/PageComponents/ToastConfig";

const EditPermissionModal = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = usePageData();
  const [name, setName] = useState<string>("");

  useEffect(() => {
    if (router.isReady && router.query.permission) {
      const permission = JSON.parse(router.query.permission as string);
      setName(permission.name || "");
    }
  }, [router.isReady, router.query]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await dispatch(updatePermission({ id: router.query.id as string, name }));
      showToast.success("Permission updated successfully");
      router.push("/permissions");
    } catch (error) {
      showToast.error("Failed to update permission");
    }
  };

  const formFields = [
    {
      type: "text" as const,
      name: "name",
      label: "Name",
      value: name,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setName(e.target.value),
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
      label: "Update"
    }
  ];

  return (
    <FormPage
      title="Edit Permission"
      subtitle="Update permission information"
      formFields={formFields}
      formActions={formActions}
      onSubmit={handleSubmit}
      protected={true}
    />
  );
};

export default function ProtectedEditPermissionModal() {
  return (
    <ProtectedRoute>
      <EditPermissionModal />
    </ProtectedRoute>
  );
}