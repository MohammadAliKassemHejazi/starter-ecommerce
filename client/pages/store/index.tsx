import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { deleteStore, fetchAllStoresWithFilter, storeSelector } from "@/store/slices/storeSlice";
import { useAppDispatch } from "@/store/store";
import { StoreTablePreset } from "@/components/UI/ModernTable";
import { TablePage } from "@/components/UI/PageComponents";
import { usePageData } from "@/hooks/usePageData";
import SubscriptionGate from "@/components/SubscriptionGate";
import ProtectedRoute from "@/components/protectedRoute";
import debounce from "lodash.debounce";
import { useRouter } from "next/router";
import Link from "next/link";

const Stores = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const stores = useSelector(storeSelector);
  const { isAuthenticated } = usePageData();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;
  
  // Memoized debounced fetch function for searching stores
  const fetchStores = useCallback(
    (query: string) => {
      dispatch(fetchAllStoresWithFilter({ searchQuery: query, page: currentPage, pageSize }));
    },
    [currentPage, dispatch, pageSize]
  );

  // Debounce the fetchStores function to prevent too many requests
  const debouncedFetchStores = useMemo(
    () => debounce(fetchStores, 1000),
    [fetchStores]
  );

  // Fetch stores on mount or when the search query changes
  useEffect(() => {
    debouncedFetchStores(searchQuery);
  }, [searchQuery, debouncedFetchStores]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedFetchStores.cancel();
    };
  }, [debouncedFetchStores]);

  // Handle store deletion
  const handleDeleteStore = async (id: string) => {
    await dispatch(deleteStore(id));
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    debouncedFetchStores(searchQuery);
  };

  // Transform stores data for the table
  const transformedStores = stores?.map((store: any) => ({
    ...store,
    imgUrl: process.env.NEXT_PUBLIC_BASE_URL_Images + store.imgUrl
  })) || [];

  const totalStores = stores?.length || 0;

  return (
    <>
      {/* Store count info */}
      <div className="mb-3">
        <span className="text-muted">
          You have: {totalStores} stores
        </span>
      </div>

      <TablePage
        title="My Stores"
        subtitle="Manage your stores and inventory"
        data={transformedStores}
        columns={StoreTablePreset.columns}
        searchPlaceholder="Search stores..."
        emptyMessage="No stores found. Create your first store to get started!"
        addButton={{
          href: '/shop/store/create',
          label: 'New Store'
        }}
        viewPath="/store"
        editPath="/store/edit"
        deleteAction={handleDeleteStore}
        exportButton={{ onClick: () => console.log('Export stores') }}
        filterButton={{ onClick: () => console.log('Filter stores') }}
        pagination={true}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onRowClick={(store) => router.push(`/store/${store.id}`)}
        headerActions={
          <SubscriptionGate requireSubscription={true}>
            <Link href="/shop/store/create">
              <span className="btn btn-primary">New Store</span>
            </Link>
          </SubscriptionGate>
        }
      />
    </>
  );
};

export default function ProtectedStores() {
  return (
    <ProtectedRoute>
      <Stores />
    </ProtectedRoute>
  );
}