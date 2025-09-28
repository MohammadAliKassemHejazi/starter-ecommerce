import { PageLayout } from "@/components/UI/PageComponents";
import ProtectedRoute from "@/components/protectedRoute";
import { usePageData } from "@/hooks/usePageData";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { showToast } from "@/components/UI/PageComponents/ToastConfig";
import Link from "next/link";
import { ActionButton } from "@/components/UI/PageComponents";

interface Article {
  id: string;
  title: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  author?: {
    name: string;
    email: string;
  };
}

const ArticleById = () => {
  const router = useRouter();
  const { pid } = router.query;
  const { isAuthenticated } = usePageData();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pid) {
      fetchArticle();
    }
  }, [pid]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/articles/${pid}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setArticle(data.data);
      } else {
        throw new Error('Failed to fetch article');
      }
    } catch (error) {
      console.error('Error fetching article:', error);
      showToast.error('Failed to load article');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (article) {
      router.push(`/articles/edit?id=${article.id}&article=${encodeURIComponent(JSON.stringify(article))}`);
    }
  };

  const handleDelete = async () => {
    if (!article) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/articles/${article.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        showToast.success('Article deleted successfully');
        router.push('/articles');
      } else {
        throw new Error('Failed to delete article');
      }
    } catch (error) {
      console.error('Error deleting article:', error);
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
                
                {article.author && (
                  <div className="mt-4 pt-3 border-top">
                    <h6>Author Information</h6>
                    <p className="mb-1"><strong>Name:</strong> {article.author.name}</p>
                    <p className="mb-0"><strong>Email:</strong> {article.author.email}</p>
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
          <p className="text-muted">The article you're looking for doesn't exist or has been removed.</p>
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