import Layout from "@/components/Layouts/Layout";
import ProtectedRoute from "@/components/protectedRoute";
import {
  articleAuthorSelector,
  deleteArticles,
  fetchArticleByAuthor,
} from "@/store/slices/articleSlice";
import { useAppDispatch } from "@/store/store";
import React from "react";
import { useSelector } from "react-redux";
import Moment from "react-moment";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import Link from "next/link";

type Props = {};

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

const Articles = ({}: Props) => {
  const dispatch = useAppDispatch();
  const articleList = useSelector(articleAuthorSelector);
  const router = useRouter();

  React.useEffect(() => {
    dispatch(fetchArticleByAuthor());
  }, [dispatch]);

  const handleDeleteArticle = async (id: string, title?: string) => {
    Swal.fire({
      title: "Do you want to delete this article?",
      html: `
      <h5>id</h5>
      <p>${id}</p>
      <h5>title</h5>
      <p>${title}</p>
      `,
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteArticles(id)).then((resp: any) => {
          if (resp.meta.requestStatus === "fulfilled") {
            Toast.fire({
              icon: "success",
              title: "Article deleted successfully",
            });
            dispatch(fetchArticleByAuthor());
          } else {
            Toast.fire({
              icon: "error",
              title: "Failed to delete article",
            });
          }
        });
      }
    });
  };

  return (
    <Layout>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <h1 className="mb-4 text-center fw-bold">My Articles</h1>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <span className="text-muted">
                You have: {articleList?.length || 0} article{articleList?.length !== 1 && "s"}
              </span>
              <Link href="/articles/create" className="btn btn-primary">
                New Article
              </Link>
            </div>
<div className="table-responsive shadow-sm  bg-white">
  <table className="table table-hover table-bordered border-secondary">
    <thead className="bg-dark text-light text-center border-bottom border-dark">
      <tr>
        <th scope="col" className="border-top-0">#</th>
        <th scope="col" className="border-top-0">Title</th>
        <th scope="col" className="border-top-0">Text</th>
        <th scope="col" className="border-top-0">Updated At</th>
        <th scope="col" className="border-top-0">Actions</th>
      </tr>
    </thead>
    <tbody>
      {articleList?.map((article, idx) => (
        <tr key={idx} className="align-middle text-center border-bottom">
          <td className="border-start border-end">{idx + 1}</td>
          <td className="fw-semibold border-start border-end">{article.title}</td>
          <td className="text-truncate border-start border-end" style={{ maxWidth: "200px" }}>
            {article.text}
          </td>
          <td className="border-start border-end">
            <Moment format="DD/MM/YYYY HH:mm">{article.updatedAt}</Moment>
          </td>
          <td className="border-start border-end">
            <div className="btn-group">
              <button
                className="btn btn-danger btn-sm me-2"
                onClick={() => handleDeleteArticle(article.id, article.title)}
              >
                Delete
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => router.push(`/articles/edit?id=${article.id}`)}
              >
                Edit
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default function ProtectedArticles() {
  return (
    <ProtectedRoute>
      <Articles />
    </ProtectedRoute>
  );
}