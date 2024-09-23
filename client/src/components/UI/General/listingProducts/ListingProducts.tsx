import React, { useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { IProductModel } from "@/models/product.model";
import { fetchProductsListing } from "@/store/slices/shopSlice"; 
import { addToCart } from "@/store/slices/cartSlice";
import { useAppDispatch } from "@/store/store"; 
import { useSelector } from "react-redux";
interface ProductListProps {}

const ProductList: React.FC<ProductListProps> = () => {
  const dispatch = useAppDispatch();
  const products = useSelector((state:any) => state.products.products) as IProductModel[]; 
  const productStatus = useSelector((state:any) => state.products.status);
  const page = useSelector((state:any) => state.products.page);
  
  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Fetch the initial products
    dispatch(fetchProductsListing({page:1,pageSize:10}));
  }, [dispatch]);

  const getTagAndColor = (product: IProductModel) => {
    let tag = '';
    let tagColor = '';

    if (product.discount && product.discount > 0) {
      tag = 'Sale';
      tagColor = 'red';
    } else if (product.createdAt && new Date(product.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) {
      tag = 'New';
      tagColor = 'green';
    } else if (product.stockQuantity === 0) {
      tag = 'Out of Stock';
      tagColor = 'black';
    }

    return { tag, tagColor };
  };

  const handleAddToCart = (product: IProductModel) => {
    dispatch(addToCart(product));
  };

  const lastProductRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (productStatus === "loading") { return };
      if (observer.current) {observer.current.disconnect();}
      
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          dispatch(fetchProductsListing(page));
        }
      });

      if (node) {observer.current.observe(node);}
    },
    [dispatch, productStatus, page]
  );

return (
  <div className="container bg-white">
    {productStatus === "loading" && products.length === 0 ? (
      <div>Loading...</div>
    ) : (
      <div className="row">
        {products.map((product, index) => {
          const { tag, tagColor } = getTagAndColor(product);
          return (
            <div
              key={product.id}
              ref={index === products.length - 1 ? lastProductRef : null}
              className="col-lg-3 col-sm-6 d-flex flex-column align-items-center justify-content-center product-item my-3"
            >
              <div className="product">
                {product.photos && (
                  <Image
                    src={process.env.NEXT_PUBLIC_BASE_URL_Images + product.photos[0]?.imageUrl ?? ""}
                    alt=""
                    width={300}
                    height={350}
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
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className={`fas fa-star ${i < (product.ratings ?? 0) ? 'text-warning' : ''}`}></span>
                ))}
              </div>
              <div className="price">${product.price}</div>
            </div>
          );
        })}
      </div>
    )}
    <div ref={loadMoreRef}></div>
  </div>
);

};

export default ProductList;
