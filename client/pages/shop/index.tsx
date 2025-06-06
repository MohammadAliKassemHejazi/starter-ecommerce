import Layout from "@/components/Layouts/Layout";
import protectedRoute from "@/components/protectedRoute";
import {
  deleteProduct,
  fetchProductsByStore,
  totalProductsSelector,
  pageSelector,
  pageSizeSelector,
  productByStoreSelector,
} from "@/store/slices/shopSlice";
import { fetchAllStores, storeSelector } from "@/store/slices/storeSlice";
import { store, useAppDispatch } from "@/store/store";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import Link from "next/link";
import Image from "next/image";
import Moment from "react-moment";
import { IProductModel } from "@/models/product.model";
import { IStoreResponseModel } from "@/models/store.model";
import debounce from "lodash.debounce"
type Props = {};

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});



const Shop = ({}: Props) => {
   const dispatch = useAppDispatch();
  const productList = useSelector(productByStoreSelector) as IProductModel[];
  const totalProducts = useSelector(totalProductsSelector);
  const currentPage = useSelector(pageSelector);
  const pageSize = useSelector(pageSizeSelector);
  const stores = useSelector(storeSelector) as IStoreResponseModel[];
  const [selectedStore, setSelectedStore] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();

  // Memoized debounced fetch function
  const fetchProducts = useCallback(
    (query: string) => {
      dispatch(
        fetchProductsByStore({
          storeId: selectedStore,
          page: currentPage,
          pageSize,
          searchQuery: query,
        })
      );
    },
    [selectedStore, currentPage, pageSize, dispatch]
  );

  // Debounce the fetch function
  const debouncedFetchProducts = useMemo(
    () => debounce(fetchProducts, 2000),
    [fetchProducts]
  );

  // Fetch stores on mount
  useEffect(() => {
    store.dispatch(fetchAllStores());
  }, [dispatch]);

  // Fetch products when store, page, pageSize, or searchQuery changes
  useEffect(() => {
    if (selectedStore) {
      debouncedFetchProducts(searchQuery);
    }
  }, [selectedStore, currentPage, pageSize, searchQuery, debouncedFetchProducts]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedFetchProducts.cancel();
    };
  }, [debouncedFetchProducts]);

  // Fetch stores on mount
  useEffect(() => {
    store.dispatch(fetchAllStores());
  }, [dispatch]);

  // Fetch products when store, page, pageSize, or searchQuery changes
  useEffect(() => {
    if (selectedStore) {
      debouncedFetchProducts(searchQuery);
    }
  }, [selectedStore, currentPage, pageSize, searchQuery, debouncedFetchProducts]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedFetchProducts.cancel();
    };
  }, [debouncedFetchProducts]);

  const handleDeleteProduct = async (id: string, name?: string) => {
    Swal.fire({
      title: "Do you want to delete this product?",
      html: `
      <h5>id</h5>
      <p>${id}</p>
      <h5>name</h5>
      <p>${name}</p>
      `,
      showCancelButton: true,
      confirmButtonText: "delete",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteProduct(id)).then((resp: any) => {
          if (resp.meta.requestStatus === "fulfilled") {
            Toast.fire({
              icon: "success",
              title: "Product deleted successfully",
            });

            dispatch(
              fetchProductsByStore({
                storeId: selectedStore!,
                page: currentPage,
                pageSize,
                searchQuery,
              })
            );
          } else {
            Toast.fire({
              icon: "error",
              title: "Failed to delete product",
            });
          }
        });
      }
    });
  };

  const handlePageChange = (newPage: number) => {
    dispatch(
      fetchProductsByStore({
        storeId: selectedStore!,
        page: newPage,
        pageSize,
        searchQuery,
      })
    );
  };

  const totalPages = Math.ceil(totalProducts / pageSize);

  return (
    <Layout>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-12">
            <h1 className="mb-5 text-center mt-3">My Products</h1>

            <div className="d-flex justify-content-between mb-3">
              <select
                className="form-select"
                value={selectedStore ?? ""}
                onChange={(e) => setSelectedStore(e.target.value)}
              >
                <option value="" disabled>
                  Select Store
                </option>
                {stores?.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </select>

              <Link className="col-md-5 text-end" href="shop/product/create">
                <span className="btn btn-primary">New Product</span>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search products by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <span className="float-start">
              You have: {totalProducts} products
            </span>
          </div>

          {/* Render product list */}
          <div className="col-md-12">
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr className="text-center text-light bg-dark">
                    <th>ID</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Updated At</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {productList?.map((product, idx) => (
                    <tr key={idx} className="text-center">
                      <td>{product.id}</td>
                      <td>
                        {product.photos && (
                          <Image
                            src={
                              process.env.NEXT_PUBLIC_BASE_URL_Images +
                              product.photos[0]?.imageUrl
                            }
                            alt={product?.name ?? ""}
                            width={50}
                            height={50}
                          />
                        )}
                      </td>
                      <td>{product.name}</td>
                      <td>{product.price}</td>
                      <td>
                        <Moment format="DD/MM/YYYY HH:mm">
                          {product?.updatedAt ?? ""}
                        </Moment>
                      </td>
                      <td>
                        <div className="btn-group">
                          <button
                            className="btn btn-danger me-2"
                            onClick={() =>
                              handleDeleteProduct(product?.id ?? "", product.name)
                            }
                          >
                            Delete
                          </button>
                          <button
                            className="btn btn-primary"
                            onClick={() =>
                              router.push(`/shop/product/edit?id=${product.id}`)
                            }
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-between mt-3">
              <button
                className="btn btn-secondary"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="btn btn-secondary"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default protectedRoute(Shop);
