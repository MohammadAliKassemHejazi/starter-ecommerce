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
import SubscriptionGate from '../SubscriptionGate';
import { usePermissions } from '@/hooks/usePermissions';
import Navigation from './Navigation';
import { getNavigationItems, getQuickActions } from '@/config/navigation';
import { ROLES } from '@/constants/permissions';

export default function Navbar() {
  const dispatch = useAppDispatch();
  const user = useSelector(userSelector);
  const { t } = useTranslation();
  const { userRoles, isSuperAdmin, isAdmin, isCustomer, hasActiveSubscription } = usePermissions();
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

  const userRole = userRoles?.[0]?.name || 'user';
  const quickActions = getQuickActions(userRole);
  const navigationItems = getNavigationItems(userRole, user?.permissions || []);

  // Get navbar styling based on user role with darker, more sophisticated colors
  const getNavbarStyling = () => {
    if (isSuperAdmin()) {
      return "navbar navbar-expand-lg navbar-dark shadow-lg sticky-top";
    } else if (isAdmin()) {
      return "navbar navbar-expand-lg navbar-dark shadow-lg sticky-top";
    } else if (hasActiveSubscription()) {
      return "navbar navbar-expand-lg navbar-dark shadow-lg sticky-top";
    } else {
      return "navbar navbar-expand-lg navbar-dark shadow-lg sticky-top";
    }
  };

  // Get navbar background color with custom dark gradients
  const getNavbarBackground = () => {
    if (isSuperAdmin()) {
      return {
        background: "linear-gradient(135deg, #8B0000 0%, #DC143C 50%, #B22222 100%)",
        borderBottom: "2px solid #FFD700"
      };
    } else if (isAdmin()) {
      return {
        background: "linear-gradient(135deg, #001F3F 0%, #003366 50%, #004080 100%)",
        borderBottom: "2px solid #00BFFF"
      };
    } else if (hasActiveSubscription()) {
      return {
        background: "linear-gradient(135deg, #0F4C3A 0%, #006400 50%, #228B22 100%)",
        borderBottom: "2px solid #32CD32"
      };
    } else {
      return {
        background: "linear-gradient(135deg, #2C2C2C 0%, #404040 50%, #555555 100%)",
        borderBottom: "2px solid #888888"
      };
    }
  };

  return (
    <nav className={getNavbarStyling()} style={getNavbarBackground()}>
      <div className="container">
        <Link href="/" className="navbar-brand d-flex align-items-center">
          <span className="fs-4 fw-bold text-white">YourLogo</span>
        </Link>
        <button
          className="navbar-toggler border-light"
          type="button"
          onClick={() => setIsNavigationOpen(true)}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-3">
            {/* Dynamic Navigation based on user role */}
            {user.isAuthenticated && navigationItems.map((item) => {
              if (item.children && item.children.length > 0) {
                return (
                  <li key={item.key} className="nav-item dropdown">
                    <Link
                      className="nav-link dropdown-toggle text-white"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                    >
                      {item.label}
                    </Link>
                    <ul className="dropdown-menu" style={{
                      background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
                      border: "1px solid #444",
                      borderRadius: "8px",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
                    }}>
                      {item.children.map((child) => (
                        <li key={child.key}>
                          <Link
                            className="dropdown-item text-white"
                            href={child.href || '#'}
                            style={{
                              transition: "all 0.3s ease",
                              borderRadius: "4px",
                              margin: "2px 4px"
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "linear-gradient(135deg, #333 0%, #555 100%)";
                              e.currentTarget.style.color = "#fff";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "transparent";
                              e.currentTarget.style.color = "#fff";
                            }}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              } else if (item.href) {
                return (
                  <li key={item.key} className="nav-item">
                    <Link
                      className="nav-link text-white"
                      href={item.href}
                      style={{
                        transition: "all 0.3s ease",
                        borderRadius: "6px",
                        padding: "8px 12px",
                        position: "relative"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              }
              return null;
            })}

            {/* Special Cart Item */}
            {user.isAuthenticated && (
              <li className="nav-item">
                <Link
                  className="nav-link text-white d-flex align-items-center"
                  href="/cart"
                  style={{
                    transition: "all 0.3s ease",
                    borderRadius: "6px",
                    padding: "8px 12px",
                    position: "relative"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <i className="bi bi-cart me-1"></i>
                  Cart
                  {cartCount > 0 && (
                    <span className="badge rounded-pill ms-1" style={{
                      background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
                      color: "white",
                      border: "1px solid #fff"
                    }}>
                      {cartCount}
                    </span>
                  )}
                </Link>
              </li>
            )}

            {/* Plans Link for non-subscribed users */}
            {user.isAuthenticated && !hasActiveSubscription() && !isSuperAdmin() && !isAdmin() && (
              <li className="nav-item">
                <Link
                  className="nav-link fw-bold"
                  href="/plans"
                  style={{
                    color: "#FFD700",
                    transition: "all 0.3s ease",
                    borderRadius: "6px",
                    padding: "8px 12px",
                    position: "relative",
                    background: "linear-gradient(135deg, rgba(255,215,0,0.1) 0%, rgba(255,165,0,0.1) 100%)",
                    border: "1px solid rgba(255,215,0,0.3)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "linear-gradient(135deg, rgba(255,215,0,0.2) 0%, rgba(255,165,0,0.2) 100%)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(255,215,0,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "linear-gradient(135deg, rgba(255,215,0,0.1) 0%, rgba(255,165,0,0.1) 100%)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <i className="fas fa-crown me-1"></i>
                  Upgrade Plan
                </Link>
              </li>
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
                <span className="d-none d-md-block text-white">
                  {t('common.welcome')}, <strong>{user.name}</strong>
                  {isSuperAdmin() && (
                    <span className="badge ms-2" style={{
                      background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
                      color: "#000",
                      border: "1px solid #fff",
                      fontWeight: "bold"
                    }}>Super Admin</span>
                  )}
                  {isAdmin() && !isSuperAdmin() && (
                    <span className="badge ms-2" style={{
                      background: "linear-gradient(135deg, #00BFFF 0%, #1E90FF 100%)",
                      color: "#fff",
                      border: "1px solid #fff"
                    }}>Admin</span>
                  )}
                  {hasActiveSubscription() && !isAdmin() && (
                    <span className="badge ms-2" style={{
                      background: "linear-gradient(135deg, #32CD32 0%, #228B22 100%)",
                      color: "#fff",
                      border: "1px solid #fff"
                    }}>Subscribed</span>
                  )}
                  {!hasActiveSubscription() && !isAdmin() && (
                    <span className="badge ms-2" style={{
                      background: "linear-gradient(135deg, #888 0%, #666 100%)",
                      color: "#fff",
                      border: "1px solid #fff"
                    }}>Free User</span>
                  )}
                </span>
                <button
                  onClick={handleSignOut}
                  className="btn btn-sm"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    color: "#fff",
                    transition: "all 0.3s ease",
                    borderRadius: "6px"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <i className="bi bi-box-arrow-right me-2"></i> {t('navigation.logout')}
                </button>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link
                  href="/auth/signin"
                  className="btn btn-sm"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    color: "#fff",
                    transition: "all 0.3s ease",
                    borderRadius: "6px"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {t('navigation.login')}
                </Link>
                <Link
                  href="/auth/signup"
                  className="btn btn-sm"
                  style={{
                    background: "linear-gradient(135deg, #007bff 0%, #0056b3 100%)",
                    border: "1px solid #007bff",
                    color: "#fff",
                    transition: "all 0.3s ease",
                    borderRadius: "6px"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "linear-gradient(135deg, #0056b3 0%, #004085 100%)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,123,255,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "linear-gradient(135deg, #007bff 0%, #0056b3 100%)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
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