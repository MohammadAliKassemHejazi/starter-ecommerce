import { PageLayout, ActionButton } from "@/components/UI/PageComponents";
import ProtectedRoute from "@/components/protectedRoute";
import { usePageData } from "@/hooks/usePageData";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { showToast } from "@/components/UI/PageComponents/ToastConfig";
import Link from "next/link";
import { useAppDispatch } from "@/store/store";
import { useSelector } from "react-redux";
import { fetchArticleById, deleteArticles } from "@/store/slices/articleSlice";
import { RootState } from "@/store/store";

const ArticleById = () => {
  const router = useRouter();
  const { pid } = router.query;
  const dispatch = useAppDispatch();
  const { isAuthenticated } = usePageData();
  const article = useSelector((state: RootState) => state.article.article);
  const loading = !article && !!pid;

  useEffect(() => {
    if (pid && typeof pid === "string") {
      dispatch(fetchArticleById(pid)).unwrap().catch(() => {
        showToast.error('Failed to load article');
      });
    }
  }, [pid, dispatch]);

  const handleEdit = () => {
    if (article) {
      router.push(`/articles/edit?id=${article.id}`);
    }
  };

  const handleDelete = async () => {
    if (!article) { return; }

    try {
      await dispatch(deleteArticles(article.id)).unwrap();
      showToast.success('Article deleted successfully');
      router.push('/articles');
    } catch (error) {
      showToast.error('Failed to delete article');
    }
  };

  const headerActions = (
    <div className="d-flex gap-2">
      <ActionButton
        onClick={handleEdit}
        label="Edit"
        icon="bi bi-pencil"
        variant="primary"
        size="sm"
      />
      <ActionButton
        onClick={handleDelete}
        label="Delete"
        icon="bi bi-trash"
        variant="danger"
        size="sm"
      />
      <ActionButton
        onClick={() => router.push('/articles')}
        label="Back to Articles"
        icon="bi bi-arrow-left"
        variant="secondary"
        size="sm"
      />
    </div>
  );

  return (
    <PageLayout 
      title={article?.title || "Article Details"} 
      subtitle="View article information"
      actions={headerActions}
    >
      {article ? (
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header bg-light">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">{article.title}</h5>
                  <div className="text-muted small">
                    {new Date(article.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="article-content">
                  <p className="lead">{article.text}</p>
                </div>
                
                {article.user && (
                  <div className="mt-4 pt-3 border-top">
                    <h6>Author Information</h6>
                    <p className="mb-1"><strong>Name:</strong> {article.user.name}</p>
                  </div>
                )}
                
                <div className="mt-4 pt-3 border-top">
                  <div className="row">
                    <div className="col-md-6">
                      <small className="text-muted">
                        <strong>Created:</strong> {new Date(article.createdAt).toLocaleString()}
                      </small>
                    </div>
                    <div className="col-md-6">
                      <small className="text-muted">
                        <strong>Updated:</strong> {new Date(article.updatedAt).toLocaleString()}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : !loading ? (
        <div className="text-center py-5">
          <h3 className="text-muted">Article not found</h3>
          <p className="text-muted">The article you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link href="/articles" className="btn btn-primary">
            <i className="bi bi-arrow-left me-2"></i>
            Back to Articles
          </Link>
        </div>
      ) : null}
    </PageLayout>
  );
};

export default function ProtectedArticleById() {
  return (
    <ProtectedRoute>
      <ArticleById />
    </ProtectedRoute>
  );
}
