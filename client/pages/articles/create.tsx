import { FormPage } from "@/components/UI/PageComponents";
import ProtectedRoute from "@/components/protectedRoute";
import { createArticles } from "@/store/slices/articleSlice";
import { useAppDispatch } from "@/store/store";
import { usePageData } from "@/hooks/usePageData";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { showToast } from "@/components/UI/PageComponents/ToastConfig";

const CreateArticle = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated } = usePageData();
  
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const handleCreateArticle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await dispatch(createArticles({ title, text })).unwrap();
      showToast.success("Article created successfully");
      router.push(`/articles/${(response as any).id}`);
    } catch (error: any) {
      showToast.error("Failed to create article");
    }
  };

  const formFields = [
    {
      type: "text" as const,
      name: "title",
      label: "Title",
      value: title,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setTitle(e.target.value),
      placeholder: "Enter title",
      required: true,
      maxLength: 150,
      helpText: "Input your article title here."
    },
    {
      type: "textarea" as const,
      name: "text",
      label: "Text",
      value: text,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setText(e.target.value),
      placeholder: "Input your body of your article here.",
      required: true,
      rows: 4,
      maxLength: 500,
      helpText: "Input your article text here."
    }
  ];

  const formActions = [
    {
      type: "button" as const,
      variant: "secondary" as const,
      label: "Cancel",
      href: "/articles"
    },
    {
      type: "submit" as const,
      variant: "primary" as const,
      label: "Create",
      onClick: (e?: React.MouseEvent<HTMLButtonElement>) => {
        if (e) {
          handleCreateArticle(e as any);
        }
      }
    }
  ];

  return (
    <FormPage
      title="Create Article"
      subtitle="Write a new article"
      formFields={formFields}
      formActions={formActions}
      onSubmit={handleCreateArticle}
      protected={true}
    />
  );
};

export default function ProtectedCreateArticle() {
  return (
    <ProtectedRoute>
      <CreateArticle />
    </ProtectedRoute>
  );
}