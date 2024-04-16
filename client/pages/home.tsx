import Layout from "@/components/Layouts/Layout";
import protectedRoute from "@/components/protectedRoute";
import { IArticleModelWithUser } from "@/models/article.model";
import { requestAllArticles } from "@/services/articleService";
import { GetServerSideProps } from "next";
import React from "react";
import Image from "next/image";
import styles from './Shop.module.css';
type Props = {
  articles?: IArticleModelWithUser[];
};

const Home = ({articles}: Props) => {
  return (
    <Layout>
      <header className="py-5 bg-light border-bottom mb-4">
        <div className="container">
          <div className="text-center my-5">
            <h1 className="fw-bolder">Next.js Starter Template</h1>
            <p className="lead mb-0">
              Welcome to Next.js 
            </p>
          </div>
        </div>
        <section id={styles["feature"]} className={` container pt-5 ` }>
  <div className={styles["fe-box"]}>
    <Image src="/products/f1.png" alt="free shipping" width={100} height={100}/>
    <h6>Free Shipping</h6>
  </div>
  
  <div className={styles["fe-box"]}>
    <Image src="/products/f2.png" alt="Online Order" width={100} height={100}/>
    <h6>Online Order</h6>
  </div>
  
  <div className={styles["fe-box"]}>
    <Image src="/products/f3.png" alt="Save Money" width={100} height={100}/>
    <h6>Save Money</h6>
  </div>
  
  <div className={styles["fe-box"]}>
    <Image src="/products/f4.png" alt="Promotions" width={100} height={100}/>
    <h6>Promotions</h6>
  </div>
  
  <div className={styles["fe-box"]}>
    <Image src="/products/f5.png" alt="Happy Sell" width={100} height={100}/>
    <h6>Happy Sell</h6>
  </div>
  
  <div className={styles["fe-box"]}>
    <Image src="/products/f6.png" alt="F24/7 Support" width={100} height={100}/>
    <h6>F24/7 Support</h6>
  </div>
  
</section>
      </header>

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
                        author: {article?.User?.name ?? ""} {article?.User?.surname ?? ""}
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

export default protectedRoute(Home);

export const getServerSideProps: GetServerSideProps = async () => {
  const articles = await requestAllArticles();
  return {
    props: {
      articles,
    },
  };
};
