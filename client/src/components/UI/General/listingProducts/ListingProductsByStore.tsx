import React, { useEffect, useRef, useCallback, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IProductModel } from "@/models/product.model";
import { fetchProductsByStore, fetchProductsListing, productByStoreSelector } from "@/store/slices/shopSlice"; 
import { useAppDispatch } from "@/store/store"; 
import { useSelector } from "react-redux";

interface ListingProductsByStore {
    storeId: string;    

}

const ListingProductsByStore: React.FC<ListingProductsByStore> = ({ storeId  }) => {
  const dispatch = useAppDispatch();
  const products = useSelector(productByStoreSelector) as IProductModel[] ; 
  const productStatus = useSelector((state: any) => state.products.status);
  const page = useSelector((state: any) => state.products.page);
    const [sortBy, setSortBy] = useState("");
  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
  
    dispatch(
    fetchProductsByStore({
              storeId: storeId,
              page: 1,
              pageSize: 20,
      searchQuery: "",
              orderBy: sortBy,
    })
    ).then(result => {
    console.log("resukt of respone ",result)
  })
  }, [dispatch,storeId,sortBy]);

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
      if (productStatus === "loading") { return; }
      if (observer.current) { observer.current.disconnect(); }
      
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          dispatch(fetchProductsListing(page));
        }
      });

      if (node) { observer.current.observe(node); }
    },
    [dispatch, productStatus, page]
  );

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Our Products</h2>
                <select
                  className="sort-dropdown w-full md:w-64 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={sortBy}
                  onChange={handleSortChange}
                >
                  <option value="default" disabled>
                    Sort By
                  </option>
                  <option value="rating">Rating</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="a-z">A-Z</option>
                  <option value="z-a">Z-A</option>
                </select>
              </div>
    <div className="container" style={{ background: 'var(--bs-component-bg)' }}>
      {productStatus === "loading" && products.length === 0 ? (
           <div className="product-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
         
         
            {products?.length === 0 &&
              Array.from({ length: 15 }).map((_, idx) => (
                <div key={idx} className="skeleton-card animate-pulse p-4">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))}
            
            
          </div>
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
                      <Link href="/favorite" legacyBehavior>
                        <span className="far fa-heart"></span>
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
      
     
  </>);
};

export default ListingProductsByStore;