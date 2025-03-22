import Layout from "@/components/Layouts/Layout";
import protectedRoute from "@/components/protectedRoute";
import { IArticleModelWithUser } from "@/models/article.model";
import { requestAllArticles } from "@/services/articleService";
import { setAuthHeaders } from "@/utils/httpClient";
import { GetServerSideProps } from "next";
import React from "react";

type Props = {
  articles?: IArticleModelWithUser[];
};

const articlesList = ({articles}: Props) => {
  return (
    <Layout>
      <div className="container">
        <div className="row">
          <React.Fragment>
            {articles?.map((article, idx) => {
              return (
                <div className="col-lg-4" key={article.id}>
                  <div className="card mb-4">
                    <div className="card-body" key={idx}>
                      <div className="small text-muted">
                        {article.createdAt}
                      </div>
                      <h2 className="card-title h4">{article.title}</h2>
                      <p className="card-text">{article.text}</p>
                      <p className="card-text">
                        author: {article?.User?.name ?? ""} 
                      </p>

                      <a className="btn btn-primary mt-3" href="./articles/">
                        Read more →
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        </div>
      </div>
    </Layout>
  );
};

export default protectedRoute(articlesList);

export const getServerSideProps: GetServerSideProps = async (context:any) => {
      const headers = context.req.headers;
 setAuthHeaders(headers);
  const articles = await requestAllArticles();
  return {
    props: {
      articles,
    },
  };
};
