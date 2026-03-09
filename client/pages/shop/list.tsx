import React from "react";
import Image from "next/image";
import { PageLayout } from "@/components/UI/PageComponents";

type Props = {};

const ListShop = ({}: Props) => {
  const products = [
    {
      id: 1,
      name: "Winter Sweater",
      price: 60.0,
      image: "https://images.pexels.com/photos/54203/pexels-photo-54203.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      tag: "sale",
      tagColor: "red",
      rating: 5
    },
    {
      id: 2,
      name: "Denim Dresses",
      price: 55.0,
      image: "https://images.pexels.com/photos/6764040/pexels-photo-6764040.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      tag: "out of stock",
      tagColor: "black",
      rating: 5
    },
    {
      id: 3,
      name: "Empire Waist Dresses",
      price: 70.0,
      image: "https://images.pexels.com/photos/914668/pexels-photo-914668.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      tag: "new",
      tagColor: "green",
      rating: 5
    },
    {
      id: 4,
      name: "Pinafore Dresses",
      price: 60.0,
      image: "https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      rating: 5
    }
  ];

  const ProductCard = ({ product }: { product: any }) => (
    <div className="col-lg-3 col-sm-6 d-flex flex-column align-items-center justify-content-center product-item my-3">
      <div className="product">
        <Image 
          src={product.image} 
          alt={product.name} 
          height={350} 
          width={300}
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

      {product.tag && (
        <div className={`tag bg-${product.tagColor}`}>
          {product.tag}
        </div>
      )}
      
      <div className="title pt-4 pb-1">{product.name}</div>
      
      <div className="d-flex align-content-center justify-content-center">
        {Array.from({ length: product.rating }, (_, i) => (
          <span key={i} className="fas fa-star"></span>
        ))}
      </div>
      
      <div className="price">$ {product.price}</div>
    </div>
  );

  return (
    <PageLayout title="Shop Products" subtitle="Browse our collection of amazing products" protected={false}>
      <div className="container bg-white">
        <div className="row">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default ListShop;