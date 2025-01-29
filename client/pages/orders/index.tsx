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
            <h1 className="mb-5 text-center mt-3">My Orders</h1>

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
            </div>

            <div className="mb-3 d-flex gap-1">
              <DatePicker
                selected={fromDate}
                onChange={(date) => setFromDate(date)}
                className="form-control"
                placeholderText="From Date"
                dateFormat="yyyy-MM-dd"
              />
              <DatePicker
                selected={toDate}
                onChange={(date) => setToDate(date)}
                className="form-control"
                placeholderText="To Date"
                dateFormat="yyyy-MM-dd"
              />
            </div>

            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <span className="float-start">
              You have: {totalOrders} orders
            </span>
          </div>

          <div className="col-md-12">
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr className="text-center text-light bg-dark">
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Total Price</th>
                    <th>Status</th>
                    <th>Updated At</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {orderList?.map((order, idx) => (
                    <tr key={idx} className="text-center">
                      <td>{order.id}</td>
                      <td>{order.customerName}</td>
                      <td>{order.totalPrice}</td>
                      <td>{order.status}</td>
                      <td>
                        <Moment format="DD/MM/YYYY HH:mm">
                          {order.updatedAt}
                        </Moment>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

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

export default protectedRoute(Orders);
