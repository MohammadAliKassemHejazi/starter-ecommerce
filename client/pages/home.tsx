import Layout from "@/components/Layouts/Layout";
import protectedRoute from "@/components/protectedRoute";
import { IArticleModelWithUser } from "@/models/article.model";
import { requestAllArticles } from "@/services/articleService";
import { GetServerSideProps } from "next";
import React from "react";
import Image from "next/image";
import styles from "./Home.module.css";
type Props = {
  articles?: IArticleModelWithUser[];
};
const stores = [
  { id: 1, name: 'Store 1' },
  { id: 2, name: 'Store 2' },
  { id: 3, name: 'Store 3' },
  { id: 4, name: 'Store 4' },
  { id: 5, name: 'Store 5' },
  { id: 6, name: 'Store 6' },
  { id: 7, name: 'Store 7' },
  { id: 8, name: 'Store 8' },
  { id: 9, name: 'Store 9' },
  { id: 10, name: 'Store 10' },
  { id: 101, name: 'Store 1' },
  { id: 102, name: 'Store 2' },
  { id: 103, name: 'Store 3' },
  { id: 104, name: 'Store 4' },
  { id: 105, name: 'Store 5' },
  { id: 106, name: 'Store 6' },
  { id: 107, name: 'Store 7' },
  { id: 108, name: 'Store 8' },
  { id: 109, name: 'Store 9' },
  { id: 1010, name: 'Store 10' },
];

const Home = ({ articles }: Props) => {
  return (
    <Layout>
      <header className="py-5 bg-light border-bottom mb-4">
        <div className="container">
          <div className="text-center my-5">
            <h1 className="fw-bolder">Next.js Starter Template</h1>
            <p className="lead mb-0">Welcome to Next.js</p>
            
            {stores.map((store) => (
         
              <input key={store.id} className={styles["bubble"]} type="checkbox" name="dummy" value="on"/>
              
        
          ))}
          </div>
        </div>
        <section id={styles["feature"]} className={` container pt-5 `}>
          <div className={styles["fe-box"]}>
            <Image
              src="/products/f1.png"
              alt="free shipping"
              width={100}
              height={100}
            />
            <h6>Free Shipping</h6>
          </div>

          <div className={styles["fe-box"]}>
            <Image
              src="/products/f2.png"
              alt="Online Order"
              width={100}
              height={100}
            />
            <h6>Online Order</h6>
          </div>

          <div className={styles["fe-box"]}>
            <Image
              src="/products/f3.png"
              alt="Save Money"
              width={100}
              height={100}
            />
            <h6>Save Money</h6>
          </div>

          <div className={styles["fe-box"]}>
            <Image
              src="/products/f4.png"
              alt="Promotions"
              width={100}
              height={100}
            />
            <h6>Promotions</h6>
          </div>

          <div className={styles["fe-box"]}>
            <Image
              src="/products/f5.png"
              alt="Happy Sell"
              width={100}
              height={100}
            />
            <h6>Happy Sell</h6>
          </div>

          <div className={styles["fe-box"]}>
            <Image
              src="/products/f6.png"
              alt="F24/7 Support"
              width={100}
              height={100}
            />
            <h6>F24/7 Support</h6>
          </div>
        </section>
      </header>
      <div className="container bg-white">
        <div className="row">
          <div className="col-lg-3 col-sm-6 d-flex flex-column align-items-center justify-content-center product-item my-3">
            <div className="product">
              <img
                src="https://images.pexels.com/photos/54203/pexels-photo-54203.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                alt=""
              />
              <ul className="d-flex align-items-center justify-content-center list-unstyled icons">
                <li className="icon">
                  <span className="fas fa-expand-arrows-alt"></span>
                </li>
                <li className="icon mx-3">
                  <span className="far fa-heart"></span>
                </li>
                <li className="icon">
                  <span className="fas fa-shopping-bag"></span>
                </li>
              </ul>
            </div>
            <div className="tag bg-red">sale</div>
            <div className="title pt-4 pb-1">Winter Sweater</div>
            <div className="d-flex align-content-center justify-content-center">
              <span className="fas fa-star"></span>
              <span className="fas fa-star"></span>
              <span className="fas fa-star"></span>
              <span className="fas fa-star"></span>
              <span className="fas fa-star"></span>{" "}
            </div>
            <div className="price">$ 60.0</div>
          </div>
          <div className="col-lg-3 col-sm-6 d-flex flex-column align-items-center justify-content-center product-item my-3">
            <div className="product">
              <img
                src="https://images.pexels.com/photos/6764040/pexels-photo-6764040.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                alt=""
              />
              <ul className="d-flex align-items-center justify-content-center list-unstyled icons">
                <li className="icon">
                  <span className="fas fa-expand-arrows-alt"></span>
                </li>
                <li className="icon mx-3">
                  <span className="far fa-heart"></span>
                </li>
                <li className="icon">
                  <span className="fas fa-shopping-bag"></span>
                </li>
              </ul>
            </div>
            <div className="tag bg-black">out of stock</div>
            <div className="title pt-4 pb-1">Denim Dresses</div>
            <div className="d-flex align-content-center justify-content-center">
              <span className="fas fa-star"></span>
              <span className="fas fa-star"></span>
              <span className="fas fa-star"></span>
              <span className="fas fa-star"></span>
              <span className="fas fa-star"></span>{" "}
            </div>
            <div className="price">$ 55.0</div>
          </div>
          <div className="col-lg-3 col-sm-6 d-flex flex-column align-items-center justify-content-center product-item my-3">
            <div className="product">
              <img
                src="https://images.pexels.com/photos/914668/pexels-photo-914668.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                alt=""
              />
              <ul className="d-flex align-items-center justify-content-center list-unstyled icons">
                <li className="icon">
                  <span className="fas fa-expand-arrows-alt"></span>
                </li>
                <li className="icon mx-3">
                  <span className="far fa-heart"></span>
                </li>
                <li className="icon">
                  <span className="fas fa-shopping-bag"></span>
                </li>
              </ul>
            </div>
            <div className="tag bg-green">new</div>
            <div className="title pt-4 pb-1"> Empire Waist Dresses</div>
            <div className="d-flex align-content-center justify-content-center">
              <span className="fas fa-star"></span>
              <span className="fas fa-star"></span>
              <span className="fas fa-star"></span>
              <span className="fas fa-star"></span>
              <span className="fas fa-star"></span>{" "}
            </div>
            <div className="price">$ 70.0</div>
          </div>
          <div className="col-lg-3 col-sm-6 d-flex flex-column align-items-center justify-content-center product-item my-3">
            <div className="product">
              <img
                src="https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                alt=""
              />
              <ul className="d-flex align-items-center justify-content-center list-unstyled icons">
                <li className="icon">
                  <span className="fas fa-expand-arrows-alt"></span>
                </li>
                <li className="icon mx-3">
                  <span className="far fa-heart"></span>
                </li>
                <li className="icon">
                  <span className="fas fa-shopping-bag"></span>
                </li>
              </ul>
            </div>
            <div className="title pt-4 pb-1">Pinafore Dresses</div>
            <div className="d-flex align-content-center justify-content-center">
              {" "}
              <span className="fas fa-star"></span>{" "}
              <span className="fas fa-star"></span>
              <span className="fas fa-star"></span>{" "}
              <span className="fas fa-star"></span>{" "}
              <span className="fas fa-star"></span>{" "}
            </div>
            <div className="price">$ 60.0</div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <React.Fragment>
            {(articles?.length ?? 0) > 0 && articles?.map((article, idx) => {
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
                        author: {article.User?.name ?? ""}
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
