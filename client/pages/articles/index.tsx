import React from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  articleAuthorSelector,
  deleteArticles,
  fetchArticleByAuthor,
} from "@/store/slices/articleSlice";
import { useAppDispatch } from "@/store/store";
import { TablePage } from "@/components/UI/PageComponents";
import { usePageData } from "@/hooks/usePageData";
import ProtectedRoute from "@/components/protectedRoute";
import Moment from "react-moment";

type Props = {};

const Articles = ({}: Props) => {
  const dispatch = useAppDispatch();
  const articleList = useSelector(articleAuthorSelector);
  const router = useRouter();
  const { isAuthenticated } = usePageData();

  React.useEffect(() => {
    dispatch(fetchArticleByAuthor());
  }, [dispatch]);

  const handleDeleteArticle = async (id: string) => {
    await dispatch(deleteArticles(id));
    dispatch(fetchArticleByAuthor()); // Refresh the list
  };

  const handleEditArticle = (article: any) => {
    router.push(`/articles/edit?id=${article.id}`);
  };

  // Table columns for articles
  const articleColumns = [
    {
      key: 'title',
      label: 'Title',
      sortable: true,
      render: (value: string) => <span className="fw-semibold">{value}</span>
    },
    {
      key: 'text',
      label: 'Content',
      render: (value: string) => (
        <div className="text-truncate" style={{ maxWidth: "200px" }} title={value}>
          {value}
        </div>
      )
    },
    {
      key: 'updatedAt',
      label: 'Updated At',
      sortable: true,
      render: (value: string) => (
        <Moment format="DD/MM/YYYY HH:mm">{value}</Moment>
      )
    }
  ];

  return (
    <TablePage
      title="My Articles"
      subtitle="Manage your articles and content"
      data={articleList || []}
      columns={articleColumns}
      searchPlaceholder="Search articles..."
      emptyMessage="No articles found. Create your first article to get started!"
      addButton={{ href: '/articles/create', label: 'New Article' }}
      editPath="/articles/edit"
      deleteAction={handleDeleteArticle}
      exportButton={{ onClick: () => console.log('Export articles') }}
      filterButton={{ onClick: () => console.log('Filter articles') }}
      customActions={[
        {
          key: 'edit',
          label: 'Edit',
          icon: 'bi bi-pencil',
          variant: 'primary',
          onClick: handleEditArticle
        },
        {
          key: 'delete',
          label: 'Delete',
          icon: 'bi bi-trash',
          variant: 'danger',
          onClick: (article) => handleDeleteArticle(article.id)
        }
      ]}
      headerActions={
        <div className="d-flex align-items-center gap-3">
          <span className="text-muted">
            You have: {articleList?.length || 0} article{articleList?.length !== 1 && "s"}
          </span>
          <Link href="/articles/create" className="btn btn-primary">
            New Article
          </Link>
        </div>
      }
    />
  );
};

export default function ProtectedArticles() {
  return (
    <ProtectedRoute>
      <Articles />
    </ProtectedRoute>
  );
}
