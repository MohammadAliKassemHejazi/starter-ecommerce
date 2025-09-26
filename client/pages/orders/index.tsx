import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  fetchOrdersByStore,
  totalOrdersSelector,
  pageSelector,
  pageSizeSelector,
  orderByStoreSelector,
} from "@/store/slices/orderSlice";
import { fetchAllStores, storeSelector } from "@/store/slices/storeSlice";
import { store, useAppDispatch } from "@/store/store";
import { TablePage } from "@/components/UI/PageComponents";
import { usePageData } from "@/hooks/usePageData";
import ProtectedRoute from "@/components/protectedRoute";
import debounce from "lodash.debounce";
import Moment from "react-moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IOrderModel } from "@/models/order.model";
import { IStoreResponseModel } from "@/models/store.model";

const Orders = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const orderList = useSelector(orderByStoreSelector) as IOrderModel[];
  const totalOrders = useSelector(totalOrdersSelector);
  const currentPage = useSelector(pageSelector);
  const pageSize = useSelector(pageSizeSelector);
  const stores = useSelector(storeSelector) as IStoreResponseModel[];
  const { isAuthenticated } = usePageData();

  const [selectedStore, setSelectedStore] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

  const fetchOrders = useCallback(() => {
    dispatch(
      fetchOrdersByStore({
        storeId: selectedStore,
        page: currentPage,
        pageSize,
        from: fromDate ? fromDate.toISOString() : undefined,
        to: toDate ? toDate.toISOString() : undefined,
      })
    );
  }, [selectedStore, currentPage, pageSize, fromDate, toDate, dispatch]);

  const debouncedFetchOrders = useMemo(
    () => debounce(fetchOrders, 2000),
    [fetchOrders]
  );

  useEffect(() => {
    store.dispatch(fetchAllStores());
  }, [dispatch]);

  useEffect(() => {
    if (selectedStore) {
      debouncedFetchOrders();
    }
  }, [selectedStore, currentPage, pageSize, fromDate, toDate, debouncedFetchOrders]);

  useEffect(() => {
    return () => {
      debouncedFetchOrders.cancel();
    };
  }, [debouncedFetchOrders]);

  const handlePageChange = (newPage: number) => {
    dispatch(
      fetchOrdersByStore({
        storeId: selectedStore,
        page: newPage,
        pageSize,
        from: fromDate ? fromDate.toISOString() : undefined,
        to: toDate ? toDate.toISOString() : undefined,
      })
    );
  };

  const handleViewOrder = (order: IOrderModel) => {
    router.push(`/orders/${order.id}`);
  };

  // Table columns for orders
  const orderColumns = [
    {
      key: 'customerName',
      label: 'Customer',
      sortable: true,
      render: (value: string) => <span className="fw-semibold">{value}</span>
    },
    {
      key: 'totalPrice',
      label: 'Total Price',
      sortable: true,
      render: (value: number) => `$${value.toFixed(2)}`
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => {
        const statusColors = {
          pending: 'warning',
          processing: 'info',
          shipped: 'primary',
          delivered: 'success',
          cancelled: 'danger'
        };
        return (
          <span className={`badge bg-${statusColors[value as keyof typeof statusColors] || 'secondary'}`}>
            {value}
          </span>
        );
      }
    },
    {
      key: 'updatedAt',
      label: 'Updated At',
      sortable: true,
      render: (value: string) => (
        <Moment format="DD/MM/YYYY HH:mm">{value}</Moment>
      )
    }
  ];

  // Filters component
  const OrderFilters = () => (
    <div className="card mb-4">
      <div className="card-header">
        <h6 className="mb-0">Filter Orders</h6>
      </div>
      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-3">
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
          <div className="col-md-2">
            <label className="form-label">From Date</label>
            <DatePicker
              selected={fromDate}
              onChange={(date) => setFromDate(date)}
              className="form-control"
              placeholderText="From Date"
              dateFormat="yyyy-MM-dd"
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">To Date</label>
            <DatePicker
              selected={toDate}
              onChange={(date) => setToDate(date)}
              className="form-control"
              placeholderText="To Date"
              dateFormat="yyyy-MM-dd"
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Search</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <button
              className="btn btn-outline-secondary w-100"
              onClick={() => {
                setSelectedStore("");
                setFromDate(null);
                setToDate(null);
                setSearchQuery("");
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <OrderFilters />
      
      <TablePage
        title="My Orders"
        subtitle="Manage and track your orders"
        data={orderList || []}
        columns={orderColumns}
        searchPlaceholder="Search orders..."
        emptyMessage="No orders found. Orders will appear here when customers place them."
        viewPath="/orders"
        exportButton={{ onClick: () => console.log('Export orders') }}
        filterButton={{ onClick: () => console.log('Filter orders') }}
        pagination={true}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        customActions={[
          {
            key: 'view',
            label: 'View',
            icon: 'bi bi-eye',
            variant: 'primary',
            onClick: handleViewOrder
          }
        ]}
        headerActions={
          <div className="d-flex align-items-center gap-3">
            <span className="text-muted">
              You have: {totalOrders} order{totalOrders !== 1 && "s"}
            </span>
          </div>
        }
      />
    </>
  );
};

export default function ProtectedOrders() {
  return (
    <ProtectedRoute>
      <Orders />
    </ProtectedRoute>
  );
}