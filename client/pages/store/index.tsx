import Layout from "@/components/Layouts/Layout";
import protectedRoute from "@/components/protectedRoute";
import {
  deleteStore,
  fetchAllStoresWithFilter,
  storeSelector,
} from "@/store/slices/storeSlice";
import { useAppDispatch } from "@/store/store";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import router from "next/router";
import Swal from "sweetalert2";
import Link from "next/link";
import Moment from "react-moment";
import debounce from "lodash.debounce";

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

const Stores = () => {
  const dispatch = useAppDispatch();
  const stores = useSelector(storeSelector); // Fetch store data
  const [searchQuery, setSearchQuery] = useState<string>(""); // State for search query
  const [currentPage, setCurrentPage] = useState<number>(1); // Pagination state
  const pageSize = 10; // Number of stores per page
  
  // Memoized debounced fetch function for searching stores
  const fetchStores = useCallback(
    (query: string) => {
      dispatch(fetchAllStoresWithFilter({ searchQuery: query, page: currentPage, pageSize }));
    },
    [currentPage, dispatch]
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
  const handleDeleteStore = async (id: string, name: string) => {
    Swal.fire({
      title: "Do you want to delete this store?",
      html: `<p>${name}</p>`,
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteStore(id)).then((resp: any) => {
          if (resp.meta.requestStatus === "fulfilled") {
            Toast.fire({
              icon: "success",
              title: "Store deleted successfully",
            });
          } else {
            Toast.fire({
              icon: "error",
              title: "Failed to delete store",
            });
          }
        });
      }
    });
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    debouncedFetchStores(searchQuery);
  };

  // Pagination calculation
  const totalStores = stores?.length;
  const totalPages = Math.ceil(totalStores! / pageSize);

  return (
    <Layout>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-12">
            <h1 className="mb-5 text-center mt-3">My Stores</h1>

            <div className="d-flex justify-content-between mb-3">
              <Link className="col-md-12 text-end" href="/shop/store/create">
                <span className="btn btn-primary">New Store</span>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search stores by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <span className="float-start">
              You have: {totalStores} stores
            </span>
          </div>

          {/* Render store list */}
          <div className="col-md-12">
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr className="text-center text-light bg-dark">
                    <th>ID</th>
                    <th>Name</th>
                    <th>Created At</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {stores?.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((store, idx) => (
                    <tr key={idx} className="text-center">
                      <td>{store.id}</td>
                      <td>{store.name}</td>
                      <td>
                        <Moment format="DD/MM/YYYY HH:mm">{store.createdAt}</Moment>
                      </td>
                      <td>
                        <div className="btn-group">
                          <button
                            className="btn btn-danger me-2"
                            onClick={() => handleDeleteStore(store.id! , store.name)}
                          >
                            Delete
                          </button>
                          <button
                            className="btn btn-primary"
                            onClick={() => router.push(`/shop/store/edit?id=${store.id}`)}
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

export default protectedRoute(Stores);
