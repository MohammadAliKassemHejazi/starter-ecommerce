import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
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
import { TablePage, FilterCard, PageLayout } from "@/components/UI/PageComponents";

import { usePermissions } from "@/hooks/usePermissions";
import { addToCart } from "@/store/slices/cartSlice";
import FavoritesButton from "@/components/UI/FavoritesButton";
import { ProductTablePreset } from "@/components/UI/ModernTable";
import { showToast, showConfirm } from "@/components/UI/PageComponents/ToastConfig";
import debounce from "lodash.debounce";
import Moment from "react-moment";
import Image from "next/image";
import Link from "next/link";
import { IProductModel } from "@/models/product.model";
import { IStoreResponseModel } from "@/models/store.model";

const Shop = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const productList = useSelector(productByStoreSelector) as IProductModel[];
  const totalProducts = useSelector(totalProductsSelector);
  const currentPage = useSelector(pageSelector);
  const pageSize = useSelector(pageSizeSelector);
  const stores = useSelector(storeSelector) as IStoreResponseModel[];
 
  const { isAdmin , isSuperAdmin , isAuthenticated} = usePermissions();

  const [selectedStore, setSelectedStore] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

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

  const debouncedFetchProducts = useMemo(
    () => debounce(fetchProducts, 2000),
    [fetchProducts]
  );

  useEffect(() => {
    store.dispatch(fetchAllStores());
  }, [dispatch]);

  useEffect(() => {
    if (selectedStore) {
      debouncedFetchProducts(searchQuery);
 
    }
  }, [selectedStore, currentPage, pageSize, searchQuery, debouncedFetchProducts]);

  useEffect(() => {
    return () => {
      debouncedFetchProducts.cancel();
    };
  }, [debouncedFetchProducts]);

  const handleDeleteProduct = async (id: string) => {
    const result = await showConfirm({
      title: "Delete Product",
      text: "Are you sure you want to delete this product?",
      confirmText: "Delete",
      cancelText: "Cancel"
    });

    if (result.isConfirmed) {
      const response = await dispatch(deleteProduct(id));
      if (response.meta.requestStatus === "fulfilled") {
        showToast.success("Product deleted successfully");
        dispatch(
          fetchProductsByStore({
            storeId: selectedStore!,
            page: currentPage,
            pageSize,
            searchQuery,
          })
        );
      } else {
        showToast.error("Failed to delete product");
      }
    }
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

  const handleAddToCart = (product: IProductModel) => {
    if (!isAuthenticated) {
      router.push("/auth/signup");
      return;
    }
    dispatch(addToCart(product));
    showToast.success("Product added to cart!");
  };

  const handleEditProduct = (product: IProductModel) => {
    router.push(`/shop/product/edit?id=${product.id}`);
  };

  const handleViewProduct = (product: IProductModel) => {
    router.push(`/shop/product/${product.id}`);
  };

  // Transform products for table

  const transformedProducts = productList?.map((product: any) => ({
    ...product,
    ProductImages: product.photos?.map((photo: any) => ({
      url: process.env.NEXT_PUBLIC_BASE_URL_Images + photo.imageUrl
    })) || []
  })) || [];

  // Shopping view component
  const ShoppingView = () => (
    <div className="row">
      {productList?.map((product, idx) => (
        <div key={idx} className="col-md-4 mb-4">
          <div className="card h-100">
            {product.photos && (
              <Image
                src={
                  process.env.NEXT_PUBLIC_BASE_URL_Images +
                  product.photos[0]?.imageUrl
                }
                alt={product?.name ?? ""}
                width={300}
                height={200}
                className="card-img-top"
                style={{ objectFit: 'cover' }}
              />
            )}
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">{product.name}</h5>
              <p className="card-text text-muted">{product.description}</p>
              <div className="mt-auto">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="h4 text-primary">${product.price}</span>
                  <small className="text-muted">
                    <Moment format="DD/MM/YYYY">
                      {product?.updatedAt ?? ""}
                    </Moment>
                  </small>
                </div>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-primary flex-grow-1"
                    onClick={() => handleAddToCart(product)}
                  >
                    <i className="bi bi-cart-plus me-2"></i>
                    Add to Cart
                  </button>
                  <FavoritesButton
                    productId={product.id!}
                    productName={product.name}
                    variant="icon"
                    size="sm"
                    showText={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Filters component
  const ProductFilters = () => (
    <FilterCard
      title="Filter Products"
      onClear={() => {
        setSelectedStore("");
        setSearchQuery("");
      }}
    >
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Store</label>
          <select
            className="form-select"
            value={selectedStore ?? ""}
            onChange={(e) => setSelectedStore(e.target.value)}
          >
            <option value="" disabled>Select Store</option>
            {stores?.map((store) => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Search</label>
          <input
            type="text"
            className="form-control"
            placeholder="Search products by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
    </FilterCard>
  );

  if (isAdmin || isSuperAdmin) {
    return (
      <>
        <ProductFilters />
        
        <TablePage
          title="My Products"
          subtitle="Manage your product inventory"
          data={transformedProducts}
          columns={ProductTablePreset.columns}
          searchPlaceholder="Search products..."
          emptyMessage="No products found. Create your first product to get started!"
          addButton={{ href: '/shop/product/create', label: 'New Product' }}
          viewPath="/shop/product"
          editPath="/shop/product/edit"
          deleteAction={handleDeleteProduct}
          exportButton={{ onClick: () => console.log('Export products') }}
          filterButton={{ onClick: () => console.log('Filter products') }}
          pagination={true}
          pageSize={pageSize}

          headerActions={
            <div className="d-flex align-items-center gap-3">
              <span className="text-muted">
                You have: {totalProducts} products
              </span>
              <Link href="/shop/product/create">
                <span className="btn btn-primary">New Product</span>
              </Link>
            </div>
          }
        />
      </>
    );
  }

  return (
     <PageLayout title="Shop Products" subtitle="Browse our collection of amazing products" protected={false}>
      <ProductFilters />
      
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h2 fw-bold text-dark mb-0">Shop Products</h1>
            <span className="text-muted">
              Found: {totalProducts} products
            </span>
          </div>
          
          <ShoppingView />
          
          {/* Pagination */}
          <div className="d-flex justify-content-between mt-4">
            <button
              className="btn btn-secondary"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </button>
            <span className="d-flex align-items-center">
              Page {currentPage} of {Math.ceil(totalProducts / pageSize)}
            </span>
            <button
              className="btn btn-secondary"
              disabled={currentPage === Math.ceil(totalProducts / pageSize)}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
   </PageLayout>
  );
};

export default Shop;