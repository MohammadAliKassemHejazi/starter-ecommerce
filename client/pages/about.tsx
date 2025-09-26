import Layout from "@/components/Layouts/Layout";
import ProtectedRoute from "@/components/protectedRoute";
import { IArticleModelWithUser } from "@/models/article.model";
import { requestAllArticles } from "@/services/articleService";
import { GetServerSideProps } from "next";
import React from "react";
import styles from "./Home.module.css";
import Link from "next/link";
import ParticleComponent from "@/components/UI/home/starsbackground/starsbackground";
import { setAuthHeaders } from "@/utils/httpClient";
import Image from "next/image";
import FavoritesButton from "@/components/UI/FavoritesButton";
import { PageLayout } from "@/components/UI/PageComponents";

type Props = {
  articles?: IArticleModelWithUser[];
};

const stores = [
  { id: 1, name: 'Store 1', logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Gucci_logo.svg/512px-Gucci_logo.svg.png?20180702130155" },
  { id: 2, name: 'Store 2', logo: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Dior_Logo.svg" },
  { id: 3, name: 'Store 3', logo: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Zara_Logo.svg" },
  { id: 4, name: 'Store 4', logo: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Dior_Logo.svg" },
  { id: 5, name: 'Store 5', logo: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Dior_Logo.svg" },
  { id: 6, name: 'Store 6', logo: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Dior_Logo.svg" },
  { id: 7, name: 'Store 7', logo: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Zalando_logo.svg" },
  { id: 8, name: 'Store 8', logo: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Zalando_logo.svg" },
  { id: 9, name: 'Store 9', logo: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Dior_Logo.svg" },
  { id: 10, name: 'Store 10', logo: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Zalando_logo.svg" },
  { id: 101, name: 'Store 11', logo: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Zalando_logo.svg" },
  { id: 102, name: 'Store 12', logo: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Zalando_logo.svg" },
  { id: 103, name: 'Store 13', logo: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Zalando_logo.svg" },
  { id: 104, name: 'Store 14', logo: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Zalando_logo.svg" },
  { id: 105, name: 'Store 15', logo: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Zalando_logo.svg" },
  { id: 107, name: 'Store 16', logo: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Zalando_logo.svg" },
  { id: 108, name: 'Store 17', logo: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Zalando_logo.svg" },
  { id: 111, name: 'Store 18', logo: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Zalando_logo.svg" },
];

const products = [
  {
    "id": 1,
    "image": "https://upload.wikimedia.org/wikipedia/commons/0/0b/Zalando_logo.svg",
    "title": "Winter Sweater",
    "tag": "sale",
    "tagColor": "red",
    "rating": 5,
    "price": 60.0,
  },
  {
    "id": 2,
    "image": "https://images.pexels.com/photos/6764040/pexels-photo-6764040.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    "title": "Denim Dresses",
    "tag": "out of stock",
    "tagColor": "black",
    "rating": 4,
    "price": 55.0,
  }
];

const About = ({ articles }: Props) => {
  const StoreBubbles = () => (
    <header className="py-5 bg-black border-bottom mb-4 overflow-hidden">
      <ParticleComponent />
      <div className="container">
        <div className={`text-center ${styles["circular-container"]}`}>
          {stores.map((store, index) => (
            <div 
              key={index} 
              className={`${styles["bubble"]} ${styles["scaling-animation"]}`}
              style={{
                animationDuration: `${Math.random() * 2 + 1}s`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            >
              <div className={styles["bubble-logo"]}>
                <Image src={store.logo} alt={`${store.name} logo`} width={100} height={100} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </header>
  );

  const ProductCard = ({ product }: { product: any }) => (
    <div className="col-lg-3 col-sm-6 d-flex flex-column align-items-center justify-content-center product-item my-3">
      <div className="product">
        <Image src={product.image} alt={product.title} width={100} height={100} />
        <ul className="d-flex align-items-center justify-content-center list-unstyled icons">
          <li className="icon">
            <Link href={`/shop/${product.id}`} legacyBehavior>
              <span className="fas fa-expand-arrows-alt"></span>
            </Link>
          </li>
          <li className="icon mx-3">
            <FavoritesButton
              productId={product.id.toString()}
              productName={product.title}
              variant="text"
              size="sm"
              showText={false}
            />
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
          <span key={index + Math.random()} className={`fas fa-star ${index < product.rating ? 'text-warning' : ''}`}></span>
        ))}
      </div>
      <div className="price">${product.price}</div>
    </div>
  );

  const ProductsSection = () => (
    <div className="container bg-white">
      <div className="row">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );

  const ArticleCard = ({ article }: { article: IArticleModelWithUser }) => (
    <div className="col-lg-4">
      <div className="card mb-4">
        <div className="card-body">
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

  const ArticlesSection = () => (
    <div className="container">
      <div className="row">
        {(articles?.length ?? 0) > 0 && articles?.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );

  return (
    <PageLayout title="About Us" subtitle="Learn more about our platform" protected={false}>
      <StoreBubbles />
      <ProductsSection />
      <ArticlesSection />
    </PageLayout>
  );
};

export default function ProtectedAbout() {
  return (
    <ProtectedRoute>
      <About />
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