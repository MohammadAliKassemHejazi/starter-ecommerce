import React from "react";
import { useSelector } from "react-redux";
import { selectPublicArticles } from "@/store/slices/publicSlice";
import Link from "next/link";

const LatestArticles: React.FC = () => {
  const articles = useSelector(selectPublicArticles);

  // Take top 3 articles
debugger
   if (articles.length === 0) {
    return null;
  }
  const latestArticles = articles?.slice(0, 3) || [];

  if (latestArticles.length === 0) {
    return null;
  }

  return (
    <section className="py-5" style={{ background: 'var(--bs-component-bg)' }}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold mb-0">Latest News</h2>
          <Link href="/articles" className="btn btn-outline-primary btn-sm">
            View All
          </Link>
        </div>

        <div className="row g-4">
          {latestArticles.map((article) => (
            <div key={article.id} className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm hover-card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <small className="text-muted">
                      {new Date(article.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </small>
                    <span className="badge bg-light text-dark border">News</span>
                  </div>
                  <h5 className="card-title fw-bold mb-3">
                    <Link href={`/articles/${article.id}`} className="text-decoration-none text-dark stretched-link">
                      {article.title}
                    </Link>
                  </h5>
                  <p className="card-text text-muted line-clamp-3">
                    {article.text}
                  </p>
                </div>
                <div className="card-footer bg-transparent border-0 pt-0 pb-3">
                  <div className="d-flex align-items-center">
                    <div className="small">
                      <span className="text-muted">By </span>
                      <span className="fw-bold">{article.User?.name || "Admin"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .hover-card {
          transition: transform 0.2s ease-in-out;
        }
        .hover-card:hover {
          transform: translateY(-5px);
        }
      `}</style>
    </section>
  );
};

export default LatestArticles;
