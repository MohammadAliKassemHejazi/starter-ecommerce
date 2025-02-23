import Layout from "@/components/Layouts/Layout";
import protectedRoute from "@/components/protectedRoute";
import {
  fetchOrdersByStore,
  totalOrdersSelector,
  pageSelector,
  pageSizeSelector,
  orderByStoreSelector,
} from "@/store/slices/orderSlice";
import { fetchAllStores, storeSelector } from "@/store/slices/storeSlice";
import { store, useAppDispatch } from "@/store/store";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import debounce from "lodash.debounce";
import Moment from "react-moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IOrderModel } from "@/models/order.model";
import { IStoreResponseModel } from "@/models/store.model";

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

const Orders = () => {
  const dispatch = useAppDispatch();
  const orderList = useSelector(orderByStoreSelector) as IOrderModel[];
  const totalOrders = useSelector(totalOrdersSelector);
  const currentPage = useSelector(pageSelector);
  const pageSize = useSelector(pageSizeSelector);
  const stores = useSelector(storeSelector) as IStoreResponseModel[];

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

  const totalPages = Math.ceil(totalOrders / pageSize);

  return (
    <Layout>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-12">
            <h1 className="mb-4 text-center fw-bold">My Orders</h1>
            <div className="d-flex flex-column flex-md-row gap-3 mb-4">
              {/* Store Selector */}
              <select
                className="form-select flex-grow-1"
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

              {/* Date Pickers */}
              <DatePicker
                selected={fromDate}
                onChange={(date) => setFromDate(date)}
                className="form-control flex-grow-1"
                placeholderText="From Date"
                dateFormat="yyyy-MM-dd"
              />
              <DatePicker
                selected={toDate}
                onChange={(date) => setToDate(date)}
                className="form-control flex-grow-1"
                placeholderText="To Date"
                dateFormat="yyyy-MM-dd"
              />

              {/* Search Input */}
              <input
                type="text"
                className="form-control flex-grow-1"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Total Orders Count */}
            <span className="text-muted d-block mb-4">
              You have: {totalOrders} order{totalOrders !== 1 && "s"}
            </span>

            {/* Orders Table */}
            <div className="table-responsive shadow-sm bg-white">
              <table className="table table-hover table-bordered border-secondary">
                <thead className="bg-dark text-light text-center">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Customer</th>
                    <th scope="col">Total Price</th>
                    <th scope="col">Status</th>
                    <th scope="col">Updated At</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orderList?.map((order, idx) => (
                    <tr key={idx} className="align-middle text-center">
                      <td>{order.id}</td>
                      <td>{order.customerName}</td>
                      <td>${order.totalPrice.toFixed(2)}</td>
                      <td>{order.status}</td>
                      <td>
                        <Moment format="DD/MM/YYYY HH:mm">
                          {order.updatedAt}
                        </Moment>
                      </td>
                      <td>
                        <button className="btn btn-primary btn-sm">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <nav aria-label="Page navigation" className="mt-4">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 && "disabled"}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    Previous
                  </button>
                </li>
                <li className="page-item">
                  <span className="page-link">
                    Page {currentPage} of {totalPages}
                  </span>
                </li>
                <li
                  className={`page-item ${
                    currentPage === totalPages && "disabled"
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default protectedRoute(Orders);