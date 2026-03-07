import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { updateUser } from "@/store/slices/myUsersSlice";
import { useAppDispatch } from "@/store/store";
import { FormPage } from "@/components/UI/PageComponents";
import { usePageData } from "@/hooks/usePageData";
import ProtectedRoute from "@/components/protectedRoute";
import { showToast } from "@/components/UI/PageComponents/ToastConfig";

const EditUserModal = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = usePageData();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    if (router.isReady && router.query.user) {
      const user = JSON.parse(router.query.user as string);
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [router.isReady, router.query]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await dispatch(updateUser({ id: router.query.id as string, name, email }));
      showToast.success("User updated successfully");
      router.push("/users");
    } catch (error) {
      showToast.error("Failed to update user");
    }
  };

  const formFields = [
    {
      type: "text" as const,
      name: "name",
      label: "Name",
      value: name,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setName(e.target.value),
      placeholder: "Enter user name",
      required: true,
      maxLength: 150,
      helpText: "Input the user name here."
    },
    {
      type: "email" as const,
      name: "email",
      label: "Email",
      value: email,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setEmail(e.target.value),
      placeholder: "Enter user email",
      required: true,
      helpText: "Input the users email here."
    }
  ];

  const formActions = [
    {
      type: "button" as const,
      variant: "secondary" as const,
      label: "Cancel",
      href: "/users"
    }
  ];

  return (
    <FormPage
      title="Edit User"
      subtitle="Update user information"
      formFields={formFields}
      formActions={formActions}
      onSubmit={handleSubmit}
      protected={true}
    />
  );
};

export default function ProtectedEditUserModal() {
  return (
    <ProtectedRoute>
      <EditUserModal />
    </ProtectedRoute>
  );
}