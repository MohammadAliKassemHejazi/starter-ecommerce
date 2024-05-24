import Layout from "@/components/Layouts/Layout";
import protectedRoute from "@/components/protectedRoute";
import { IArticleModelWithUser } from "@/models/article.model";
import { requestAllArticles } from "@/services/articleService";
import { GetServerSideProps } from "next";
import React from "react";
import Image from "next/image";
import styles from "./Home.module.css";
import Link from "next/link";
type Props = {
  articles?: IArticleModelWithUser[];
};
const stores = [
  { id: 1, name: 'Store 1' ,logo:"data:image/png;base64,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"},
  { id: 2, name: 'Store 2',logo:"https://images.pexels.com/photos/54203/pexels-photo-54203.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" },
  { id: 3, name: 'Store 3' ,logo:"https://images.pexels.com/photos/54203/pexels-photo-54203.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"},
  { id: 4, name: 'Store 4' ,logo:"https://images.pexels.com/photos/54203/pexels-photo-54203.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"},
  { id: 5, name: 'Store 5' ,logo:"https://images.pexels.com/photos/54203/pexels-photo-54203.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"},
  { id: 6, name: 'Store 6' ,logo:"https://images.pexels.com/photos/54203/pexels-photo-54203.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"},
  { id: 7, name: 'Store 7' ,logo:"https://images.pexels.com/photos/54203/pexels-photo-54203.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"},
  { id: 8, name: 'Store 8' ,logo:"https://images.pexels.com/photos/54203/pexels-photo-54203.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"},
  { id: 9, name: 'Store 9' ,logo:"https://images.pexels.com/photos/54203/pexels-photo-54203.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"},
  { id: 10, name: 'Store 10' ,logo:"https://images.pexels.com/photos/54203/pexels-photo-54203.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"},
  { id: 101, name: 'Store 1',logo:"https://images.pexels.com/photos/54203/pexels-photo-54203.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" },
  { id: 102, name: 'Store 2',logo:"https://images.pexels.com/photos/54203/pexels-photo-54203.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" },
  { id: 103, name: 'Store 3' ,logo:"https://images.pexels.com/photos/54203/pexels-photo-54203.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"},
  { id: 104, name: 'Store 4',logo:"https://images.pexels.com/photos/54203/pexels-photo-54203.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" },
  { id: 105, name: 'Store 5',logo:"https://images.pexels.com/photos/54203/pexels-photo-54203.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" },
  { id: 103, name: 'Store 3',logo:"https://images.pexels.com/photos/54203/pexels-photo-54203.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" },
  { id: 104, name: 'Store 4',logo:"https://images.pexels.com/photos/54203/pexels-photo-54203.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" },
  { id: 105, name: 'Store 5',logo:"https://images.pexels.com/photos/54203/pexels-photo-54203.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" },
 
];
const products =[
  {
    "id": 1,
    "image": "https://images.pexels.com/photos/54203/pexels-photo-54203.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    "title": "Winter Sweater",
    "tag": "sale",
    "tagColor": "red",
    "rating": 5,
    "price": 60.0
  },
  {
    "id": 2,
    "image": "https://images.pexels.com/photos/6764040/pexels-photo-6764040.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    "title": "Denim Dresses",
    "tag": "out of stock",
    "tagColor": "black",
    "rating": 4,
    "price": 55.0
  }
]
const Home = ({ articles }: Props) => {
  return (
    <Layout>
      <header className="py-5 bg-light border-bottom mb-4">
      <div className="container">
          <div className={`text-center  ${styles["circular-container"]}`}>

            
            {stores.map((store) => (
         
              <div key={store.id} className={`${styles["bubble"]} ${styles["scaling-animation"]}`}  style={{
                animationDuration: `${Math.random() * 2 + 1}s`, // Random duration between 1 and 3 seconds
                animationDelay: `${Math.random() * 2}s`, // Random delay between 0 and 2 seconds
              }}>
                 <div className={styles["bubble-logo"]}>
              <img src={store.logo} alt={`${store.name} logo`} />
            </div>
                </div>
              
        
          ))}
          </div>
        </div>
     
      </header>
      <div className="container bg-white">
      <div className="row">
        {products.map((product) => (
          <div key={product.id} className="col-lg-3 col-sm-6 d-flex flex-column align-items-center justify-content-center product-item my-3">
            <div className="product">
              <img src={product.image} alt={product.title} />
              <ul className="d-flex align-items-center justify-content-center list-unstyled icons">
           
                <li className="icon">
                <Link href={`/shop/${product.id}`} legacyBehavior>
                <span className="fas fa-expand-arrows-alt">
               
                </span>
                </Link>
               
                </li>
            
                <li className="icon mx-3">
                <Link href="/favorite" legacyBehavior>
                  <span className="far fa-heart"></span>
                  </Link>
                </li>
                <li className="icon">
                <Link href="/addtocart" legacyBehavior>
                  <span className="fas fa-shopping-bag"></span>
                  </Link>
                </li>
              </ul>
            </div>
            {product.tag && <div className={`tag bg-${product.tagColor}`}>{product.tag}</div>}
            <div className="title pt-4 pb-1">{product.title}</div>
            <div className="d-flex align-content-center justify-content-center">
              {Array.from({ length: 5 }, (_, index) => (
                <span key={index} className={`fas fa-star ${index < product.rating ? 'text-warning' : ''}`}></span>
              ))}
            </div>
            <div className="price">${product.price}</div>
          </div>
        ))}
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
