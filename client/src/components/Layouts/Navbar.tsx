import { signOut, userSelector } from "@/store/slices/userSlice";
import { useAppDispatch } from "@/store/store";
import Link from "next/link";
import Script from "next/script";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import Router from "next/router";
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher';
import RoleBasedAccess from '../RoleBasedAccess';
import { usePermissions } from '@/hooks/usePermissions';
import Navigation from './Navigation';
import { getQuickActions } from '@/config/navigation';

export default function Navbar() {
  const dispatch = useAppDispatch();
  const user = useSelector(userSelector);
  const { t } = useTranslation();
  const { isAdmin, isVendor, hasPermission } = usePermissions();
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

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

  // Fetch cart count
  React.useEffect(() => {
    const fetchCartCount = async () => {
      if (user) {
        try {
          const response = await fetch('/api/cart');
          if (response.ok) {
            const data = await response.json();
            setCartCount(data.data?.items?.length || 0);
          }
        } catch (error) {
          console.error('Error fetching cart count:', error);
        }
      }
    };

    fetchCartCount();
  }, [user]);

  const userRole = user?.role || 'user';
  const quickActions = getQuickActions(userRole);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark bg-opacity-80 shadow-sm sticky-top">
      <div className="container">
        <Link href="/" className="navbar-brand d-flex align-items-center">
          <span className="fs-4 fw-bold text-black">YourLogo</span>
        </Link>
        <button
          className="navbar-toggler border-black"
          type="button"
          onClick={() => setIsNavigationOpen(true)}
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
                        className="dropdown-item text-white hover-text-dark d-flex align-items-center justify-content-between"
                        href="/cart"
                      >
                        <span>Cart</span>
                        {cartCount > 0 && (
                          <span className="badge bg-primary rounded-pill">
                            {cartCount}
                          </span>
                        )}
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
                        {t('admin.subcategories')}
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item text-white hover-text-dark"
                        href="/favorites"
                      >
                        {t('navigation.favorites')}
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
                <RoleBasedAccess requiredRoles={['admin', 'vendor']}>
                  <li className="nav-item dropdown">
                    <Link
                      className="nav-link dropdown-toggle text-black"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                    >
                      {t('navigation.dashboard')}
                    </Link>
                    <ul className="dropdown-menu bg-dark bg-opacity-90 border-black">
                      <li>
                        <Link
                          className="dropdown-item text-white hover-text-dark"
                          href="/dashboard"
                        >
                          {t('admin.dashboard')}
                        </Link>
                      </li>
                      <RoleBasedAccess requiredRoles={['admin']}>
                        <li>
                          <Link
                            className="dropdown-item text-white hover-text-dark"
                            href="/users"
                          >
                            {t('admin.users')}
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item text-white hover-text-dark"
                            href="/roles"
                          >
                            {t('admin.roles')}
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item text-white hover-text-dark"
                            href="/roles/Assignment"
                          >
                            {t('roles.assignPermissions')}
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item text-white hover-text-dark"
                            href="/permissions"
                          >
                            {t('admin.permissions')}
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item text-white hover-text-dark"
                            href="/promotions"
                          >
                            {t('admin.promotions')}
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item text-white hover-text-dark"
                            href="/analytics"
                          >
                            {t('admin.analytics')}
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item text-white hover-text-dark"
                            href="/packages"
                          >
                            Packages
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item text-white hover-text-dark"
                            href="/shipping"
                          >
                            Shipping
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item text-white hover-text-dark"
                            href="/sizes"
                          >
                            Sizes
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item text-white hover-text-dark"
                            href="/taxes"
                          >
                            Taxes
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item text-white hover-text-dark"
                            href="/returns"
                          >
                            Returns
                          </Link>
                        </li>
                      </RoleBasedAccess>
                    </ul>
                  </li>
                </RoleBasedAccess>
              </>
            )}
          </ul>

          {/* Language Switcher */}
          <div className="me-3">
            <LanguageSwitcher />
          </div>

          {/* Authentication Section */}
          <div className="d-flex align-items-center gap-3">
            {user.isAuthenticated ? (
              <div className="d-flex align-items-center gap-3">
                <span className="d-none d-md-block text-black">
                  {t('common.welcome')}, <strong>{user.name}</strong>
                </span>
                <button
                  onClick={handleSignOut}
                  className="btn btn-outline-black btn-sm"
                >
                  <i className="bi bi-box-arrow-right me-2"></i> {t('navigation.logout')}
                </button>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link
                  href="/auth/signin"
                  className="btn btn-outline-black btn-sm"
                >
                  {t('navigation.login')}
                </Link>
                <Link
                  href="/auth/signup"
                  className="btn btn-black btn-sm text-white"
                >
                  {t('navigation.register')}
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
      
      {/* Mobile Navigation */}
      <Navigation 
        isOpen={isNavigationOpen} 
        onClose={() => setIsNavigationOpen(false)} 
      />
    </nav>
  );
}