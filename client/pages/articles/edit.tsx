import { FormPage } from "@/components/UI/PageComponents";
import ProtectedRoute from "@/components/protectedRoute";
import { IArticleModel } from "@/models/article.model";
import { requestArticleById } from "@/services/articleService";
import { updateArticles } from "@/store/slices/articleSlice";
import { useAppDispatch } from "@/store/store";
import { setAuthHeaders } from "@/utils/httpClient";
import { usePageData } from "@/hooks/usePageData";
import { showToast } from "@/components/UI/PageComponents/ToastConfig";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

type Props = {
  article?: IArticleModel;
};

const EditArticle = ({ article }: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated } = usePageData();
  const [title, setTitle] = useState<string>("");
  const [text, setText] = useState<string>("");

  useEffect(() => {
    if (article) {
      setTitle(article.title || "");
      setText(article.text || "");
    }
  }, [article]);

  const handleUpdateArticle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const id = article?.id;
      const response = await dispatch(updateArticles({ id, title, text }));
      if (response.meta.requestStatus === "fulfilled") {
        showToast.success("Article updated successfully");
        router.push("/articles");
      } else {
        showToast.error("Failed to update article");
      }
    } catch (error) {
      showToast.error("Failed to update article");
    }
  };

  const formFields = [
    {
      type: "text" as const,
      name: "title",
      label: "Title",
      value: title,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setTitle(e.target.value),
      placeholder: "Enter article title",
      required: true,
      maxLength: 150,
      helpText: "Input your article title here."
    },
    {
      type: "textarea" as const,
      name: "text",
      label: "Text",
      value: text,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setText(e.target.value),
      placeholder: "Input your article text here.",
      required: true,
      rows: 4,
      helpText: "Input your article text here."
    }
  ];

  const formActions = [
    {
      type: "button" as const,
      variant: "secondary" as const,
      label: "Cancel",
      href: "/articles"
    }
  ];

  return (
    <FormPage
      title="Edit Article"
      subtitle="Update article information"
      formFields={formFields}
      formActions={formActions}
      onSubmit={handleUpdateArticle}
      protected={true}
    />
  );
};

export default function ProtectedEditArticle() {
  return (
    <ProtectedRoute>
      <EditArticle />
    </ProtectedRoute>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { id }: any = context.query;
  const headers = context.req.headers;

  setAuthHeaders(headers);

  if (id) {
    const article = await requestArticleById(id);
    return {
      props: {
        article,
      },
    };
  } else {
    return { props: {} };
  }
};