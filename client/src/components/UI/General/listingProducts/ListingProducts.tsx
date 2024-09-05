import React from "react";
import Link from "next/link";
import Image from "next/image";
import { IProductModel } from "@/models/product.model";

interface ProductListProps {
  products: IProductModel[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {

  const getTagAndColor = (product: IProductModel) => {
    // Define the conditions for tag and color
    let tag = '';
    let tagColor = '';

    if (product.discount && product.discount > 0) {
      tag = 'Sale';
      tagColor = 'red';
    } else if (product.createdAt && new Date(product.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) {
      // Assuming the product is considered "new" if created within the last 30 days
      tag = 'New';
      tagColor = 'green';
    } else if (product.stockQuantity === 0) {
      tag = 'Out of Stock';
      tagColor = 'black';
    }

    return { tag, tagColor };
  };

  return (
    <div className="container bg-white">
      <div className="row">
        {products.map((product) => {
          const { tag, tagColor } = getTagAndColor(product); // Get dynamic tag and color

          return (
            <div key={product.id} className="col-lg-3 col-sm-6 d-flex flex-column align-items-center justify-content-center product-item my-3">
              <div className="product">
                {product.photos && (
                  <Image
                    src={process.env.NEXT_PUBLIC_BASE_URL_Images + product.photos[0]?.imageUrl ?? ""}
                    alt={product?.name ?? ""}
                    width={100}
                    height={100}
                  />
                )}

                <ul className="d-flex align-items-center justify-content-center list-unstyled icons">
                  <li className="icon">
                    <Link href={`/shop/${product.id}`} legacyBehavior>
                      <span className="fas fa-expand-arrows-alt"></span>
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

              {tag && <div className={`tag bg-${tagColor}`}>{tag}</div>}

              <div className="title pt-4 pb-1">{product.name}</div>
              <div className="d-flex align-content-center justify-content-center">
                {Array.from({ length: 5 }, (_, index) => (
                  <span key={index + Math.random()} className={`fas fa-star ${index < (product.ratings ?? 0) ? 'text-warning' : ''}`}></span>
                ))}
              </div>
              <div className="price">${product.price}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductList;
