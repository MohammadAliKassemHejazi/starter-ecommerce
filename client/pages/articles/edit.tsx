import Layout from "@/components/Layouts/Layout";
import ProtectedRoute from "@/components/protectedRoute";
import { IArticleModel } from "@/models/article.model";
import { requestArticleById } from "@/services/articleService";
import { updateArticles } from "@/store/slices/articleSlice";
import { useAppDispatch } from "@/store/store";
import { setAuthHeaders } from "@/utils/httpClient";

import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Link from "next/link";

type Props = {
  article?: IArticleModel;
};

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

const EditArticle = ({ article }: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
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
        Toast.fire({
          icon: "success",
          title: "Article updated successfully",
        });
        router.push("/articles");
      } else {
        Toast.fire({
          icon: "error",
          title: "Failed to update article",
        });
      }
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Failed to update article",
      });
    }
  };

  return (
    <Layout>
      <div className="container">
        <div className="row justify-content-center py-5 vh-100">
          <div className="col-lg-9 col-md-12 mb-4">
            <form onSubmit={handleUpdateArticle} className="mt-5">
              <h1 className="mb-4">Edit Article</h1>
              <div className="form-group">
                <label htmlFor="InputArticleTitle" className="form-label">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={150}
                  className="form-control"
                  id="InputArticleTitle"
                  placeholder="Enter article title"
                  required
                />
                <small id="articleTitleHelp" className="form-text text-muted">
                  Input your article title here.
                </small>
              </div>
              <div className="form-group">
                <label htmlFor="InputArticleText" className="form-label">
                  Text
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={4}
                  className="form-control"
                  id="InputArticleText"
                  placeholder="Input your article text here."
                  required
                />
                <small id="articleTextHelp" className="form-text text-muted">
                  Input your article text here.
                </small>
              </div>
              <Link href="/articles">
                <button type="button" className="btn btn-secondary mt-3 me-3">
                  Cancel
                </button>
              </Link>
              <button type="submit" className="btn btn-primary mt-3">
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
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