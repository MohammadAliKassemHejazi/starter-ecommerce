import React, { useState } from "react";
import { createUser } from "@/store/slices/myUsersSlice";
import { useAppDispatch } from "@/store/store";
import { useSelector } from "react-redux";
import { userSelector } from "@/store/slices/userSlice";
import { FormPage } from "@/components/UI/PageComponents";
import { usePageData } from "@/hooks/usePageData";
import ProtectedRoute from "@/components/protectedRoute";
import Link from "next/link";
import router from "next/router";
import { showToast } from "@/components/UI/PageComponents/ToastConfig";

const CreateUserModal = () => {
  const dispatch = useAppDispatch();
  const currentUser = useSelector(userSelector);
  const { isAuthenticated } = usePageData();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await dispatch(
        createUser({
          name,
          email,
          password,
            createdById: currentUser!.id,
        })
      ).unwrap();
      showToast.success("User created successfully");
      if (response.data.id) {
        void router.push(`/users`); // Redirect to the new user page
      }
    } catch (error) {
      showToast.error("Failed to create user");
    }
  };

  const formFields = [
    {
      type: "text" as const,
      name: "name",
      label: "Name",
      value: name,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setName(e.target.value),
      placeholder: "Enter user name",
      required: true,
      maxLength: 150,
      helpText: "Input the users name here."
    },
    {
      type: "email" as const,
      name: "email",
      label: "Email",
      value: email,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setEmail(e.target.value),
      placeholder: "Enter user email",
      required: true,
      helpText: "Input the users email here."
    },
    {
      type: "password" as const,
      name: "password",
      label: "Password",
      value: password,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setPassword(e.target.value),
      placeholder: "Enter user password",
      required: true,
      minLength: 6,
      helpText: "Input the user password here (minimum 6 characters)."
    }
  ];

  const formActions = [
    {
      type: "button" as const,
      variant: "secondary" as const,
      label: "Cancel",
      href: "/users"
    },
    {
      type: "submit" as const,
      variant: "primary" as const,
      label: "Create"
    }
  ];

  return (
    <FormPage
      title="Create User"
      subtitle="Add a new user to the system"
      formFields={formFields}
      formActions={formActions}
      onSubmit={handleCreateUser}
      protected={true}
    />
  );
};

export default function ProtectedCreateUserModal() {
  return (
    <ProtectedRoute>
      <CreateUserModal />
    </ProtectedRoute>
  );
}