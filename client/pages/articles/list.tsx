import React from "react";
import { IArticleModelWithUser } from "@/models/article.model";
import { requestAllArticles } from "@/services/articleService";
import { setAuthHeaders } from "@/utils/httpClient";
import { GetServerSideProps } from "next";
import { TablePage } from "@/components/UI/PageComponents";
import SubscriptionGate from "@/components/SubscriptionGate";
import ProtectedRoute from "@/components/protectedRoute";
import { useRouter } from "next/router";

type Props = {
  articles?: IArticleModelWithUser[];
};

const ArticlesList = ({ articles }: Props) => {
  const router = useRouter();

  const handleViewArticle = (article: IArticleModelWithUser) => {
    router.push(`/articles/${article.id}`);
  };

  const handleEditArticle = (article: IArticleModelWithUser) => {
    router.push(`/articles/edit?article=${encodeURIComponent(JSON.stringify(article))}`);
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
        <div className="text-truncate" style={{ maxWidth: '300px' }} title={value}>
          {value}
        </div>
      )
    },
    {
      key: 'User',
      label: 'Author',
      render: (value: any) => value?.name || 'Unknown'
    },
    {
      key: 'createdAt',
      label: 'Created At',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString()
    }
  ];

  return (
    <TablePage
      title="Articles"
      subtitle="Browse and manage articles"
      data={articles || []}
      columns={articleColumns}
      searchPlaceholder="Search articles..."
      emptyMessage="No articles found. Create your first article to get started!"
      addButton={{ href: '/articles/create', label: 'Create Article' }}
      viewPath="/articles"
      editPath="/articles/edit"
      exportButton={{ onClick: () => console.log('Export articles') }}
      filterButton={{ onClick: () => console.log('Filter articles') }}
      customActions={[
        {
          key: 'view',
          label: 'Read More',
          icon: 'bi bi-eye',
          variant: 'primary',
          onClick: handleViewArticle
        },
        {
          key: 'edit',
          label: 'Edit',
          icon: 'bi bi-pencil',
          variant: 'secondary',
          onClick: handleEditArticle,
          show: () => true // Will be wrapped in SubscriptionGate
        }
      ]}
      headerActions={
        <SubscriptionGate requireSubscription={true}>
          <a className="btn btn-primary" href="/articles/create">
            <i className="fas fa-plus me-2"></i>
            Create Article
          </a>
        </SubscriptionGate>
      }
    />
  );
};

export default function ProtectedArticlesList() {
  return (
    <ProtectedRoute>
      <ArticlesList />
    </ProtectedRoute>
  );
}

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const headers = context.req.headers;
  setAuthHeaders(headers);
  const articles = await requestAllArticles();
  return {
    props: {
      articles,
    },
  };
};