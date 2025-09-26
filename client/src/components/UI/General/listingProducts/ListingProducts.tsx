import React, { useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { IProductModel } from "@/models/product.model";
import { fetchPublicProducts, loadMorePublicProducts, selectPublicProducts, selectPublicPagination, selectPublicLoading } from "@/store/slices/publicSlice"; 
import { useAppDispatch } from "@/store/store"; 
import { useSelector } from "react-redux";
import FavoritesButton from "@/components/UI/FavoritesButton";

interface ProductListProps {}

const ProductList: React.FC<ProductListProps> = () => {
  const dispatch = useAppDispatch();
  const products = useSelector(selectPublicProducts) as IProductModel[]; 
  const loading = useSelector(selectPublicLoading);
  const pagination = useSelector(selectPublicPagination);
  
  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    dispatch(fetchPublicProducts({ page: 1, pageSize: 10 }));
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

  const lastProductRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading.products) { return; }
      if (observer.current) { observer.current.disconnect(); }
      
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && pagination.products.hasMore) {
          dispatch(loadMorePublicProducts());
        }
      });

      if (node) { observer.current.observe(node); }
    },
    [dispatch, loading.products, pagination.products.hasMore]
  );

  return (
    <div className="container bg-white">
      {loading.products && products.length === 0 ? (
        <div>Loading...</div>
      ) : (
        <div className="row">
          {products.map((product, index) => {
            const { tag, tagColor } = getTagAndColor(product);

            // Calculate sale price if there's a discount
            const salePrice = product.discount
              ? (product.price!) - (product.price! * (product.discount / 100))
              : null;

            return (
              <div
                key={product.id}
                ref={index === products.length - 1 ? lastProductRef : null}
                className="col-lg-3 col-sm-6 d-flex flex-column align-items-center justify-content-center product-item my-3"
              >
                <div className="product">
                  {product.photos && (
                    <Image
                      src={process.env.NEXT_PUBLIC_BASE_URL_Images + product.photos[0]?.imageUrl}
                      alt=""
                      width={300}
                      height={350}
                    />
                  )}

                  <ul className="d-flex align-items-center justify-content-center list-unstyled icons">
                    <li className="icon">
                      <Link href={`/shop/product/${product.id}`} legacyBehavior>
                        <span className="fas fa-expand-arrows-alt"></span>
                      </Link>
                    </li>
                    <li className="icon mx-3">
                      <FavoritesButton 
                        productId={product.id!} 
                        variant="icon"
                        showText={false}
                        className="p-0 border-0 bg-transparent"
                      />
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

                {/* Price Display */}
                <div className="price">
                  {salePrice ? (
                    <>
                      <span className="text-danger font-weight-bold">${salePrice.toFixed(2)}</span>
                      <span className="text-muted ml-2">
                        <del>${product.price?.toFixed(2)}</del>
                      </span>
                    </>
                  ) : (
                    <span>${product.price?.toFixed(2)}</span>
                  )}
                </div>
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