import { signOut, userSelector } from "@/store/slices/userSlice";
import { useAppDispatch } from "@/store/store";
import Link from "next/link";
import Script from "next/script";
import React from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import Router from "next/router";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const user = useSelector(userSelector);

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  const handleSignOut = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You'll need to log in again to access your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, sign out",
    });
    if (result.isConfirmed) {
      const response = await dispatch(signOut());
      if (response.meta.requestStatus === "fulfilled") {
        Router.push("/auth/signin");
        Toast.fire({
          icon: "success",
          title: "Signed out successfully",
        });
      }
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark bg-opacity-80 shadow-sm sticky-top">
      <div className="container">
        <Link href="/" className="navbar-brand d-flex align-items-center">
          <span className="fs-4 fw-bold text-black">YourLogo</span>
        </Link>
        <button
          className="navbar-toggler border-black"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-3">
            {/* Manage Dropdown */}
            {user.isAuthenticated && (
              <>
                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle text-black"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                  >
                    Manage
                  </Link>
                  <ul className="dropdown-menu bg-dark bg-opacity-90 border-black">
                    <li>
                      <Link
                        className="dropdown-item text-white hover-text-dark"
                        href="/articles"
                      >
                        Articles
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item text-white hover-text-dark"
                        href="/shop"
                      >
                        Shop
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item text-white hover-text-dark"
                        href="/store"
                      >
                        Stores
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider border-white" />
                    </li>
                    <li>
                      <Link
                        className="dropdown-item text-white hover-text-dark"
                        href="/cart"
                      >
                        Cart
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item text-white hover-text-dark"
                        href="/orders"
                      >
                        Orders
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item text-white hover-text-dark"
                        href="/categories"
                      >
                        Categories
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item text-white hover-text-dark"
                        href="/subcategories"
                      >
                        Subcategories
                      </Link>
                    </li>
                    
                  </ul>
                </li>

                {/* Create Dropdown */}
                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle text-black"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                  >
                    Create
                  </Link>
                  <ul className="dropdown-menu bg-dark bg-opacity-90 border-black">
                    <li>
                      <Link
                        className="dropdown-item text-white hover-text-dark"
                        href="/store/create"
                      >
                        New Store
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item text-white hover-text-dark"
                        href="/shop/product/create"
                      >
                        New Product
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item text-white hover-text-dark"
                        href="/articles/create"
                      >
                        New Article
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item text-white hover-text-dark"
                        href="/categories/create"
                      >
                        New Category
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item text-white hover-text-dark"
                        href="/subcategories/create"
                      >
                        New Subcategory
                      </Link>
                    </li>
                  </ul>
                </li>

                {/* Dashboard Dropdown */}
                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle text-black"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                  >
                    Dashboard
                  </Link>
                  <ul className="dropdown-menu bg-dark bg-opacity-90 border-black">
                    <li>
                      <Link
                        className="dropdown-item text-white hover-text-dark"
                        href="/dashboard"
                      >
                        Overview
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item text-white hover-text-dark"
                        href="/users"
                      >
                        Users
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item text-white hover-text-dark"
                        href="/roles"
                      >
                        Roles
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item text-white hover-text-dark"
                        href="/permissions"
                      >
                        Permissions
                      </Link>
                    </li>
                  </ul>
                </li>
              </>
            )}
          </ul>

          {/* Authentication Section */}
          <div className="d-flex align-items-center gap-3">
            {user.isAuthenticated ? (
              <div className="d-flex align-items-center gap-3">
                <span className="d-none d-md-block text-black">
                  Welcome, <strong>{user.name}</strong>
                </span>
                <button
                  onClick={handleSignOut}
                  className="btn btn-outline-black btn-sm"
                >
                  <i className="bi bi-box-arrow-right me-2"></i> Sign Out
                </button>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link
                  href="/auth/signin"
                  className="btn btn-outline-black btn-sm"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="btn btn-black btn-sm text-white"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <Script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/js/bootstrap.bundle.min.js"
        strategy="lazyOnload"
      />
    </nav>
  );
}