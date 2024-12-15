import {  signOut, userSelector } from "@/store/slices/userSlice";
import { useAppDispatch } from "@/store/store";
import Link from "next/link";
import Script from "next/script";
import React from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import Router from "next/router";
type Props = {};

export default function Navbar({}: Props) {
  const dispatch = useAppDispatch();
  const user = useSelector(userSelector);

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  const handleSignOut = async () => {
    const response = await dispatch(signOut());
    if (response.meta.requestStatus === "fulfilled") {
      Router.push("/auth/signin");
      Toast.fire({
        icon: "success",
        title: "Signed out successfully",
      });
    }
  };

  return (
    <nav className="navbar navbar-expand-md sticky-top bg-light">
      <div className="container-fluid">
        <Link href="/">
          <span className="navbar-brand">
            {user.isAuthenticated && (
              <React.Fragment>
                <span className="nav-link me-3">Welcome {user.name}</span>
              </React.Fragment>
            )}
          </span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarCollapse"
          aria-controls="navbarCollapse"
          aria-expanded="false"
          aria-label="toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <ul className="navbar-nav me-auto mb-2 mb-md-0">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" href="#"></Link>
            </li>
            <li className="nav-item">
              {user.isAuthenticated && (
                // eslint-disable-next-line @next/next/no-html-link-for-pages
                <Link href="/articles" className="nav-link">
                  articles
                </Link>
              )}
            </li>
            <li className="nav-item">
              <Link href="/shop" className="nav-link">
                shop
              </Link>
              <Link href="/cart" className="nav-link">
                cart
              </Link>
            
            </li>
            <li className="nav-item">
            <Link href="/store" className="nav-link">
                  stores
              </Link>
            
            </li>
            <li className="nav-item">
            <Link href="/store/create" className="nav-link">
                  Create store
                </Link>
            </li>
      
            <li className="nav-item">
            <Link href="/shop/product/create" className="nav-link">
                  Create Product
                </Link>
            </li>
                
          </ul>
          <div className="d-flex me-5">
            {user.isAuthenticated && (
              <React.Fragment>

              

                <button
                  className="btn btn-outline-primary"
                  onClick={() => {
                    handleSignOut();
                  }}
                >
                  Sign Out
                </button>
              </React.Fragment>
            )}

            {!user.isAuthenticated && (
              <React.Fragment>
                <button className="btn btn-outline-primary me-1">
                  <Link href="/auth/signin">SignIn</Link>
                </button>
                <button className="btn btn-outline-primary me-1">
                  <Link href="/auth/signup">SignUp</Link>
                </button>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
      <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/js/bootstrap.bundle.min.js"></Script>
    </nav>
  );
}
