import { IArticleModelWithUser } from "@/models/article.model";
import { requestAllArticles } from "@/services/articleService";
import { GetServerSideProps } from "next";
import React, { useState, useEffect } from "react";
import styles from "./Home.module.scss";
import Link from "next/link";
import ParticleComponent from "@/components/UI/home/starsbackground/starsbackground";
import { setAuthHeaders } from "@/utils/httpClient";
import Image from "next/image";
import { PageLayout } from "@/components/UI/PageComponents";
import dynamic from 'next/dynamic';

// Dynamically import FavoritesButton to prevent SSR issues
const FavoritesButton = dynamic(() => import('@/components/UI/FavoritesButton'), {
  ssr: false,
  loading: () => <span className="fas fa-heart" style={{ color: 'var(--bs-secondary)' }}></span>
});

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
  { id: 11, name: 'Store 11', logo: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Zalando_logo.svg" },
  { id: 12, name: 'Store 12', logo: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Zalando_logo.svg" },
  { id: 13, name: 'Store 13', logo: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Zalando_logo.svg" },
  { id: 14, name: 'Store 14', logo: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Zalando_logo.svg" },
  { id: 15, name: 'Store 15', logo: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Zalando_logo.svg" },
  { id: 16, name: 'Store 16', logo: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Zalando_logo.svg" },
  { id: 17, name: 'Store 17', logo: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Zalando_logo.svg" },
  { id: 18, name: 'Store 18', logo: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Zalando_logo.svg" },
];

const products = [
  {
    "id": 1,
    "image": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    "title": "Winter Sweater",
    "tag": "sale",
    "tagColor": "red",
    "rating": 5,
    "price": 60.0,
  },
  {
    "id": 2,
    "image": "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop",
    "title": "Denim Dresses",
    "tag": "out of stock",
    "tagColor": "black",
    "rating": 4,
    "price": 55.0,
  },
  {
    "id": 3,
    "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    "title": "Running Shoes",
    "tag": "new",
    "tagColor": "green",
    "rating": 5,
    "price": 120.0,
  },
  {
    "id": 4,
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    "title": "Wireless Headphones",
    "tag": "sale",
    "tagColor": "red",
    "rating": 4,
    "price": 89.99,
  }
];

const About = ({ articles }: Props) => {
  const StoreBubbles = () => (
    <header className="py-5 bg-black border-bottom mb-4 overflow-hidden position-relative">
      <ParticleComponent />
      <div className="container position-relative">
        <div className="text-center mb-4">
          <h1 className="text-white display-4 fw-bold mb-3">About Our Platform</h1>
          <p className="text-white-50 lead">Discover amazing products from top brands</p>
        </div>
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
                <Image 
                  src={store.logo} 
                  alt={`${store.name} logo`} 
                  width={80} 
                  height={80}
                  className="rounded"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </header>
  );

  const ProductCard = ({ product }: { product: any }) => (
    <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
      <div className="card h-100 shadow-sm border-0 product-card">
        <div className="position-relative overflow-hidden">
          <Image 
            src={product.image} 
            alt={product.title} 
            width={300} 
            height={250} 
            className="card-img-top"
            style={{ objectFit: 'cover', transition: 'transform 0.3s ease' }}
          />
          {product.tag && (
            <div className={`position-absolute top-0 end-0 m-2 px-2 py-1 rounded text-white small ${
              product.tagColor === 'red' ? 'bg-danger' : 
              product.tagColor === 'black' ? 'bg-dark' : 
              product.tagColor === 'green' ? 'bg-success' : 'bg-secondary'
            }`}>
              {product.tag}
            </div>
          )}
          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center product-overlay">
            <div className="d-flex gap-3">
              <Link href={`/shop/${product.id}`} className="btn btn-light btn-sm rounded-circle">
                <i className="fas fa-expand-arrows-alt"></i>
              </Link>
              <FavoritesButton
                productId={product.id.toString()}
                productName={product.title}
                product={product}
                variant="text"
                size="sm"
                showText={false}
              />
              <Link href="/cart" className="btn btn-primary btn-sm rounded-circle">
                <i className="fas fa-shopping-bag"></i>
              </Link>
            </div>
          </div>
        </div>
        <div className="card-body text-center">
          <h5 className="card-title mb-2">{product.title}</h5>
          <div className="d-flex justify-content-center mb-2">
            {Array.from({ length: 5 }, (_, index) => (
              <i 
                key={index} 
                className={`fas fa-star ${index < product.rating ? 'text-warning' : 'text-muted'}`}
              ></i>
            ))}
          </div>
          <div className="h5 text-primary mb-0">${product.price}</div>
        </div>
      </div>
    </div>
  );

  const ProductsSection = () => (
    <section className="py-5" style={{ background: 'var(--bs-body-bg)', color: 'var(--bs-body-color)' }}>
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold text-body">Featured Products</h2>
          <p className="lead text-muted">Discover our most popular items</p>
        </div>
        <div className="row">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );

  const ArticleCard = ({ article }: { article: IArticleModelWithUser }) => (
    <div className="col-lg-4 col-md-6 mb-4">
      <div className="card h-100 shadow-sm border-0">
        <div className="card-body d-flex flex-column">
          <div className="small text-muted mb-2">
            <i className="fas fa-calendar-alt me-1"></i>
            {new Date(article.createdAt).toLocaleDateString()}
          </div>
          <h3 className="card-title h5 mb-3">{article.title}</h3>
          <p className="card-text flex-grow-1 text-muted">
            {article.text.length > 150 ? `${article.text.substring(0, 150)}...` : article.text}
          </p>
          <div className="mt-auto">
            <div className="small text-muted mb-3">
              <i className="fas fa-user me-1"></i>
              By {article.user?.name ?? "Anonymous"}
            </div>
            <Link href="/articles" className="btn btn-outline-primary">
              Read More <i className="fas fa-arrow-right ms-1"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  const ArticlesSection = () => (
    <section className="py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold text-body">Latest Articles</h2>
          <p className="lead text-muted">Stay updated with our latest news and insights</p>
        </div>
        <div className="row">
          {(articles?.length ?? 0) > 0 ? articles?.map((article) => (
            <ArticleCard key={article.id} article={article} />
          )) : (
            <div className="col-12 text-center">
              <div className="py-5">
                <i className="fas fa-newspaper fa-3x text-muted mb-3"></i>
                <h4 className="text-muted">No articles available</h4>
                <p className="text-muted">Check back later for new content!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );

  const AboutSection = () => (
    <section className="py-5" style={{ background: 'var(--bs-component-bg)' }}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <h2 className="display-6 fw-bold mb-4">Why Choose Our Platform?</h2>
            <div className="row">
              <div className="col-md-6 mb-4">
                <div className="text-center">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                    <i className="fas fa-shipping-fast fa-lg"></i>
                  </div>
                  <h5>Fast Shipping</h5>
                  <p className="text-muted">Get your orders delivered quickly and safely</p>
                </div>
              </div>
              <div className="col-md-6 mb-4">
                <div className="text-center">
                  <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                    <i className="fas fa-shield-alt fa-lg"></i>
                  </div>
                  <h5>Secure Payment</h5>
                  <p className="text-muted">Your payment information is always protected</p>
                </div>
              </div>
              <div className="col-md-6 mb-4">
                <div className="text-center">
                  <div className="bg-warning text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                    <i className="fas fa-headset fa-lg"></i>
                  </div>
                  <h5>24/7 Support</h5>
                  <p className="text-muted">Our team is here to help you anytime</p>
                </div>
              </div>
              <div className="col-md-6 mb-4">
                <div className="text-center">
                  <div className="bg-info text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                    <i className="fas fa-undo fa-lg"></i>
                  </div>
                  <h5>Easy Returns</h5>
                  <p className="text-muted">Hassle-free returns within 30 days</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="text-center">
              <Image 
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop"
                alt="About our platform"
                width={600}
                height={400}
                className="img-fluid rounded shadow"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <PageLayout title="About Us" subtitle="Learn more about our platform" protected={false}>
      <StoreBubbles />
      <AboutSection />
      <ProductsSection />
      <ArticlesSection />
      
      <style jsx global>{`
        .product-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.15) !important;
        }
        
        .product-overlay {
          background: rgba(0,0,0,0.7);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .product-card:hover .product-overlay {
          opacity: 1;
        }
        
        .product-card:hover .card-img-top {
          transform: scale(1.05);
        }
        
        .btn-rounded {
          border-radius: 50px;
        }
        
        .text-gradient {
          background: linear-gradient(45deg, #007bff, #6f42c1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .section-divider {
          height: 2px;
          background: linear-gradient(90deg, transparent, #007bff, transparent);
          margin: 3rem 0;
        }
        
        .bubble-logo img {
          transition: transform 0.3s ease;
        }
        
        .bubble:hover .bubble-logo img {
          transform: scale(1.1);
        }
      `}</style>
    </PageLayout>
  );
};

export default About;

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  try {
    const headers = context.req.headers;
    setAuthHeaders(headers);
    const articles = await requestAllArticles();
    return {
      props: {
        articles: articles || [],
      },
    };
  } catch (error) {
    console.error('Error fetching articles:', error);
    return {
      props: {
        articles: [],
      },
    };
  }
};