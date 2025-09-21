import ProtectedRoute from "@/components/protectedRoute";
import React from "react";

type Props = {};

const ArticleById = ({ }: Props) => {

  return <div>ArticleById</div>;
};

export default function ProtectedArticleById() {
  return (
    <ProtectedRoute>
      <ArticleById />
    </ProtectedRoute>
  );
}
