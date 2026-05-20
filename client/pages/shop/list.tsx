import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import { PageLayout } from "@/components/UI/PageComponents";
import { useAppDispatch } from "@/store/store";
import {
  fetchProductsListing,
  productSelector,
  totalProductsSelector,
  pageSelector,
  pageSizeSelector,
  selectShopLoading,
} from "@/store/slices/shopSlice";
import { IProduct } from "@shared/types/product.types";

const ListShop = () => {
  const dispatch = useAppDispatch();
  const products = useSelector(productSelector) as IProduct[];
  const total = useSelector(totalProductsSelector);
  const currentPage = useSelector(pageSelector);
  const pageSize = useSelector(pageSizeSelector);
  const loading = useSelector(selectShopLoading);

  useEffect(() => {
    dispatch(fetchProductsListing({ page: 1, pageSize: 20 }));
  }, [dispatch]);

  const handlePageChange = (newPage: number) => {
    dispatch(fetchProductsListing({ page: newPage, pageSize }));
  };

  const ProductCard = ({ product }: { product: IProduct }) => {
    const imageUrl =
      product.productImages && product.productImages.length > 0
        ? process.env.NEXT_PUBLIC_BASE_URL_Images +
          (product.productImages[0] as any).imageUrl
        : null;

    const totalStock = product.sizeItems
      ? product.sizeItems.reduce((sum: number, si: any) => sum + (si.quantity || 0), 0)
      : 0;

    const tag = totalStock === 0 ? "out of stock" : product.discount ? "sale" : null;
    const tagColor = totalStock === 0 ? "black" : "red";

    return (
      <div className="col-lg-3 col-sm-6 d-flex flex-column align-items-center justify-content-center product-item my-3">
        <div className="product">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              height={350}
              width={300}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                width: 300,
                height: 350,
                background: "#eee",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span className="text-muted">No Image</span>
            </div>
          )}
          <ul className="d-flex align-items-center justify-content-center list-unstyled icons">
            <li className="icon mx-3">
              <Link href={`/shop/product/${product.id}`}>
                <span className="fas fa-expand-arrows-alt"></span>
              </Link>
            </li>
            <li className="icon">
              <span className="fas fa-shopping-bag"></span>
            </li>
          </ul>
        </div>

        {tag && (
          <div className={`tag bg-${tagColor}`}>{tag}</div>
        )}

        <div className="title pt-4 pb-1">
          <Link href={`/shop/product/${product.id}`}>{product.name}</Link>
        </div>

        <div className="price">$ {Number(product.price).toFixed(2)}</div>
      </div>
    );
  };

  return (
    <PageLayout
      title="Shop Products"
      subtitle="Browse our collection of amazing products"
      protected={false}
    >
      <div className="container bg-white">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading products...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="row">
              {products && products.length > 0 ? (
                products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-12 text-center py-5">
                  <p className="text-muted">No products available.</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {total > pageSize && (
              <div className="d-flex justify-content-between mt-4">
                <button
                  className="btn btn-secondary"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </button>
                <span className="d-flex align-items-center">
                  Page {currentPage} of {Math.ceil(total / pageSize)}
                </span>
                <button
                  className="btn btn-secondary"
                  disabled={currentPage >= Math.ceil(total / pageSize)}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </PageLayout>
  );
};

export default ListShop;
