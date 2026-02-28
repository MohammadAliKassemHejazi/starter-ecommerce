import React from "react";
import { IArticleModelWithUser } from "@/models/article.model";

interface ArticleListProps {
  articles: IArticleModelWithUser[];
}

const ArticleList: React.FC<ArticleListProps> = ({ articles }) => {
  return (
    <div className="container mb-4">
      <div className="row">
        {articles?.length > 0 ? (
          articles.map((article) => (
            <div className="col-lg-4" key={article.id}>
              <div className="card mb-4">
                <div className="card-body">
                  <div className="small text-muted">
                    {new Date(article.createdAt).toLocaleDateString()}
                  </div>
                  <h2 className="card-title h4">{article.title}</h2>
                  <p className="card-text">{article.text}</p>
                  <p className="card-text">
                    Author: {article.user?.name ?? "Unknown"}
                  </p>
                  <a className="btn btn-primary mt-3" href={`/articles/${article.id}`}>
                    Read more →
                  </a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-bold m-3 ">No articles available</div>
        )}
      </div>
    </div>
  );
};

export default ArticleList;
