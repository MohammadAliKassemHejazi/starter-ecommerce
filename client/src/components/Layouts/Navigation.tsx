import React, { useState, useEffect, useMemo } from 'react';
import { useRouter ,Router } from 'next/router';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getNavigationItems, getAnonymousNavigationItems, getQuickActions, NavigationItem as NavigationItemType } from '@/config/navigation';
import { usePermissions } from '../../hooks/usePermissions';
import NavigationItem from '../NavigationItem';
import { useAppDispatch } from '@/store/store';
// import { fetchCart } from '@/store/slices/cartSlice';
import { selectCartItemCount, selectCartIsLoading } from '@/store/slices/cartSelectors';
import { signOut } from '@/store/slices/userSlice';
import Swal from 'sweetalert2';
import LanguageSwitcher from '../LanguageSwitcher';

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavigationSection {
  title: string;
  items: NavigationItemType[];
  icon?: string;
  collapsible?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useSelector((state: any) => state.user);
  const { isAnonymous, userRoles, userPermissions, isSuperAdmin, isAdmin, hasActiveSubscription, hasPermission } = usePermissions();
  
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['main', 'user']));
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const cartCount = useSelector(selectCartItemCount);
  const cartLoading = useSelector(selectCartIsLoading);

  // Helper function to check if user can access a specific page
  const canAccessPage = (pageKey: string) => {
    if (!user.isAuthenticated) { return false };
    
    // Define page permissions
    const pagePermissions: { [key: string]: string[] } = {
      'dashboard': ['view_dashboard'],
      'shop': ['view_shop'],
      'orders': ['view_orders'],
      'analytics': ['view_analytics'],
      'cart': ['view_cart'],
      'users': ['manage_users'],
      'roles': ['manage_roles'],
      'permissions': ['manage_permissions'],
      'categories': ['manage_categories'],
      'subcategories': ['manage_subcategories'],
      'products': ['manage_products'],
      'articles': ['manage_articles'],
      'comments': ['manage_comments'],
      'promotions': ['manage_promotions'],
      'returns': ['manage_returns'],
      'store': ['manage_store'],
      'packages': ['manage_packages'],
      'shipping': ['manage_shipping'],
      'sizes': ['manage_sizes'],
      'taxes': ['manage_taxes'],
      'settings': ['manage_settings'],
      'admin-admins': ['super_admin'],
      'admin-users': ['super_admin'],
      'admin-stores': ['super_admin'],
      'admin-analytics': ['super_admin'],
      'audit-logs': ['super_admin'],
      'user-sessions': ['super_admin'],
      'system-health': ['super_admin']
    };

    const requiredPermissions = pagePermissions[pageKey];
    if (!requiredPermissions) { return true }; // If no specific permissions defined, allow access

    // Check if user has any of the required permissions
    return requiredPermissions.some(permission => hasPermission(permission));
  };

  // Use anonymous navigation if user is not authenticated
  const userRole = userRoles?.[0]?.name || 'user';
  const navigationItems = isAnonymous
    ? getAnonymousNavigationItems() 
    : getNavigationItems(userRole, userPermissions || []);
  const quickActions = isAnonymous ? [] : getQuickActions(userRole);


  // // Fetch cart data using Redux dispatch
  // useEffect(() => {
  //   if (user.isAuthenticated && !user.isGuest) {
  //     // console.log('Navigation: Fetching cart for authenticated user:', user.id);
  //     // dispatch(fetchCart());
  //   } else if (user.isGuest) {
  //     console.log('Navigation: User is in guest mode, not fetching cart');
  //   }
  // }, [user.isAuthenticated, user.isGuest, user.id, dispatch]);

  // Close sidebar when clicking outside on mobile and manage body blur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (window.innerWidth < 1200) {
        const sidebar = document.querySelector('.sidebar');
        const toggleBtn = document.querySelector('.toggle-btn');
        
        if (isOpen && sidebar && toggleBtn) {
          if (!sidebar.contains(event.target as Node) && !toggleBtn.contains(event.target as Node)) {
            onClose();
          }
        }
      }
    };

    // Add/remove body class for blur effect
    if (isOpen) {
      document.body.classList.add('sidebar-open');
      document.addEventListener('click', handleClickOutside);
    } else {
      document.body.classList.remove('sidebar-open');
    }

    return () => {
      document.body.classList.remove('sidebar-open');
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Organize navigation items into logical sections
  const navigationSections = useMemo((): NavigationSection[] => {
    if (isAnonymous) {
      return [
        {
          title: 'Main',
          items: navigationItems,
          icon: 'bi-house',
          collapsible: false
        }
      ];
    }

    const sections: NavigationSection[] = [];
    
    // Main navigation (always visible)
    const mainItems = navigationItems.filter(item => 
      ['home', 'about', 'shop', 'cart'].includes(item.key)
    );
    if (mainItems.length > 0) {
      sections.push({
        title: 'Main',
        items: mainItems,
        icon: 'bi-house',
        collapsible: false
      });
    }

    // User-specific items
    const userItems = navigationItems.filter(item => {
      const basicUserItems = ['favorites', 'orders', 'user-orders'];
      
      // Always show basic user items
      if (basicUserItems.includes(item.key)) {
        return true;
      }
      
      // Don't show upgrade plan in sidebar since it's now in navbar
      if (item.key === 'upgrade-package') {
        return false;
      }
      
      return false;
    });
    if (userItems.length > 0) {
      sections.push({
        title: 'My Account',
        items: userItems,
        icon: 'bi-person',
        collapsible: true
      });
    }

    // Admin sections - only show for actual admins
    if (userRole === 'admin' || userRole === 'super_admin' || userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
      // Dashboard
      const dashboardItems = navigationItems.filter(item => 
        item.key.includes('dashboard')
      );
      if (dashboardItems.length > 0) {
        sections.push({
          title: 'Dashboard',
          items: dashboardItems,
          icon: 'bi-speedometer2',
          collapsible: true
        });
      }

      // User Management
      const userManagementItems = navigationItems.filter(item => 
        item.key.includes('user-management') || 
        ['users', 'roles', 'role-assignment', 'permissions'].includes(item.key)
      );
      if (userManagementItems.length > 0) {
        sections.push({
          title: 'User Management',
          items: userManagementItems,
          icon: 'bi-people',
          collapsible: true
        });
      }

      // Content Management
      const contentItems = navigationItems.filter(item => 
        item.key.includes('content-management') || 
        ['categories', 'subcategories', 'products-admin', 'articles', 'comments'].includes(item.key)
      );
      if (contentItems.length > 0) {
        sections.push({
          title: 'Content',
          items: contentItems,
          icon: 'bi-folder',
          collapsible: true
        });
      }

      // Business Management
      const businessItems = navigationItems.filter(item => 
        item.key.includes('business-management') || 
        ['orders-admin', 'promotions', 'analytics', 'returns', 'my-store'].includes(item.key)
      );
      if (businessItems.length > 0) {
        sections.push({
          title: 'Business',
          items: businessItems,
          icon: 'bi-briefcase',
          collapsible: true
        });
      }

      // System Management
      const systemItems = navigationItems.filter(item => 
        item.key.includes('system-management') || 
        ['packages', 'shipping', 'sizes', 'taxes'].includes(item.key)
      );
      if (systemItems.length > 0) {
        sections.push({
          title: 'System',
          items: systemItems,
          icon: 'bi-gear',
          collapsible: true
        });
      }

      // Payment Management
      const paymentItems = navigationItems.filter(item => 
        item.key.includes('payment-management')
      );
      if (paymentItems.length > 0) {
        sections.push({
          title: 'Payment',
          items: paymentItems,
          icon: 'bi-credit-card',
          collapsible: true
        });
      }
    }

    // Super Admin specific sections
    if (userRole === 'super_admin') {
      // Platform Management
      const platformItems = navigationItems.filter(item => 
        item.key.includes('platform-management') || 
        ['all-admins', 'all-users', 'all-stores', 'platform-analytics'].includes(item.key)
      );
      if (platformItems.length > 0) {
        sections.push({
          title: 'Platform',
          items: platformItems,
          icon: 'bi-globe',
          collapsible: true
        });
      }

      // Tenant Management
      const tenantItems = navigationItems.filter(item => 
        item.key.includes('tenant-management')
      );
      if (tenantItems.length > 0) {
        sections.push({
          title: 'Tenants',
          items: tenantItems,
          icon: 'bi-building',
          collapsible: true
        });
      }

      // Monitoring
      const monitoringItems = navigationItems.filter(item => 
        item.key.includes('monitoring') || 
        ['audit-logs', 'user-sessions', 'system-health'].includes(item.key)
      );
      if (monitoringItems.length > 0) {
        sections.push({
          title: 'Monitoring',
          items: monitoringItems,
          icon: 'bi-activity',
          collapsible: true
        });
      }
    }

    // Demo Pages (if available)
    const demoItems = navigationItems.filter(item => 
      item.key.includes('demo-pages') || 
      ['navigation-demo', 'permission-demo', 'test-permissions'].includes(item.key)
    );
    if (demoItems.length > 0) {
      sections.push({
        title: 'Demo',
        items: demoItems,
        icon: 'bi-laptop',
        collapsible: true
      });
    }

    return sections;
  }, [navigationItems, userRole, isAnonymous]);

  // Filter items based on search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) {return navigationSections;}

    const filterItems = (items: NavigationItemType[]): NavigationItemType[] => {
      return items.filter(item => {
        const matchesSearch = item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             item.key.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (item.children) {
          const filteredChildren = filterItems(item.children);
          if (filteredChildren.length > 0) {
            return { ...item, children: filteredChildren };
          }
        }
        
        return matchesSearch;
      });
    };

    return navigationSections.map(section => ({
      ...section,
      items: filterItems(section.items)
    })).filter(section => section.items.length > 0);
  }, [navigationSections, searchQuery]);

  const toggleExpanded = (key: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionTitle)) {
        newSet.delete(sectionTitle);
      } else {
        newSet.add(sectionTitle);
      }
      return newSet;
    });
  };

  const handleSignOut = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You'll need to log in again to access your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: getComputedStyle(document.documentElement).getPropertyValue('--bs-primary') || '#0d6efd',
      cancelButtonColor: getComputedStyle(document.documentElement).getPropertyValue('--bs-danger') || '#dc3545',
      confirmButtonText: "Yes, sign out",
    });
    if (result.isConfirmed) {
      const response = await dispatch(signOut());
      if (response.meta.requestStatus === "fulfilled") {
        router.push("/auth/signin");
        Swal.fire({
          icon: "success",
          title: "Signed out successfully",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        });
      }
    }
  };

  const renderBadge = (badge: string | number) => {
    if (badge === 'cart-count') {
      if (cartLoading) {
        return (
          <span className="navigation-badge navigation-badge-loading">
            <i className="bi bi-arrow-clockwise spin"></i>
          </span>
        );
      }
      return cartCount > 0 ? (
        <span className="navigation-badge navigation-badge-primary">
          {cartCount}
        </span>
      ) : null;
    }
    return (
      <span className="navigation-badge navigation-badge-primary">
        {badge}
      </span>
    );
  };

  const renderNavigationItem = (item: NavigationItemType, level: number = 0) => {
    return (
      <NavigationItem
        key={item.key}
        item={item}
        level={level}
        onClose={onClose}
        expandedItems={expandedItems}
        onToggleExpanded={toggleExpanded}
      />
    );
  };

  return (
    <>
      {/* Overlay - only show when sidebar is open */}
      {isOpen && (
        <div className="navigation-overlay" onClick={onClose}></div>
      )}
      
      {/* Sidebar Container */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <i className="fas fa-cube" style={{fontSize: '28px', color: 'var(--bs-primary)'}}></i>
          <div className="logo">NexusAdmin</div>
        </div>
        
        {/* User Info */}
        {user && user.isAuthenticated ? (
          <div className="user-info">
            <div className="user-name">{user.name || 'Super Admin'}</div>
            <div className="badges">
              {isSuperAdmin && (
                <span className="badge badge-super-admin">Super Admin</span>
              )}
              {isAdmin && !isSuperAdmin && (
                <span className="badge badge-admin">Admin</span>
              )}
              {hasActiveSubscription && !isAdmin && (
                <span className="badge badge-subscribed">Subscribed</span>
              )}
              {!hasActiveSubscription && !isAdmin && (
                <span className="badge badge-free">Free User</span>
              )}
            </div>
          </div>
        ) : (
          <div className="user-info">
            <div className="user-name">Guest User</div>
            <div className="badges">
              <span className="badge badge-guest">Guest</span>
            </div>
          </div>
        )}

        {/* Language Switcher */}
        <div className="language-section sidebar-menu">
          <div className="section-title">Language</div>
          <div className="language-switcher-wrapper">
            <LanguageSwitcher />
          </div>
        </div>

        {/* Sidebar Menu */}
        <div className="sidebar-menu">
          {/* Core Navigation - Always visible for authenticated users */}
          {user.isAuthenticated && (
            <div className="menu-section">
              <Link href="/dashboard" className={router.pathname === '/dashboard' ? 'active' : ''}>
                <i className="fas fa-tachometer-alt"></i>
                <span>Dashboard</span>
              </Link>
              <Link href="/shop" className={router.pathname === '/shop' ? 'active' : ''}>
                <i className="fas fa-shopping-bag"></i>
                <span>Shop</span>
              </Link>
              <Link href="/orders" className={router.pathname === '/orders' ? 'active' : ''}>
                <i className="fas fa-receipt"></i>
                <span>Orders</span>
              </Link>
              <Link href="/analytics" className={router.pathname === '/analytics' ? 'active' : ''}>
                <i className="fas fa-chart-line"></i>
                <span>Analytics</span>
              </Link>
              <Link href="/cart" className={router.pathname === '/cart' ? 'active' : ''}>
                <i className="fas fa-shopping-cart"></i>
                <span>Cart</span>
                {user.isGuest ? (
                  <span className="badge" style={{background: 'linear-gradient(135deg, var(--bs-gray-500) 0%, var(--bs-gray-600) 100%)', color: 'var(--bs-white)', border: '1px solid var(--bs-gray-300)', padding: '2px 6px', fontSize: '10px', marginLeft: '8px'}}>Guest</span>
                ) : cartCount > 0 ? (
                  <span className="badge" style={{background: 'linear-gradient(135deg, var(--bs-primary) 0%, var(--bs-secondary) 100%)', color: 'var(--bs-white)', border: '1px solid var(--bs-gray-300)', padding: '2px 6px', fontSize: '10px', marginLeft: '8px'}}>{cartCount}</span>
                ) : null}
              </Link>
            </div>
          )}
          
          {/* User Management */}
          {(canAccessPage('users') || canAccessPage('roles') || canAccessPage('permissions')) && (
            <div className="menu-section">
              <div className="section-title">User Management</div>
              {canAccessPage('users') && (
                <Link href="/users" className={router.pathname === '/users' ? 'active' : ''}>
                  <i className="fas fa-users"></i>
                  <span>Users</span>
                </Link>
              )}
              {canAccessPage('roles') && (
                <Link href="/roles" className={router.pathname === '/roles' ? 'active' : ''}>
                  <i className="fas fa-shield-alt"></i>
                  <span>Roles</span>
                </Link>
              )}
              {canAccessPage('roles') && (
                <Link href="/roles/Assignment" className={router.pathname === '/roles/Assignment' ? 'active' : ''}>
                  <i className="fas fa-user-check"></i>
                  <span>Role Assignment</span>
                </Link>
              )}
              {canAccessPage('permissions') && (
                <Link href="/permissions" className={router.pathname === '/permissions' ? 'active' : ''}>
                  <i className="fas fa-lock"></i>
                  <span>Permissions</span>
                </Link>
              )}
            </div>
          )}
          
          {/* Content Management */}
          {(canAccessPage('categories') || canAccessPage('subcategories') || canAccessPage('products') || canAccessPage('articles') || canAccessPage('comments')) && (
            <div className="menu-section">
              <div className="section-title">Content Management</div>
              {canAccessPage('categories') && (
                <Link href="/categories" className={router.pathname === '/categories' ? 'active' : ''}>
                  <i className="fas fa-tags"></i>
                  <span>Categories</span>
                </Link>
              )}
              {canAccessPage('subcategories') && (
                <Link href="/subcategories" className={router.pathname === '/subcategories' ? 'active' : ''}>
                  <i className="fas fa-tag"></i>
                  <span>Subcategories</span>
                </Link>
              )}
              {canAccessPage('products') && (
                <Link href="/shop/product" className={router.pathname === '/products' ? 'active' : ''}>
                  <i className="fas fa-box"></i>
                  <span>Products</span>
                </Link>
              )}
              {canAccessPage('articles') && (
                <Link href="/articles" className={router.pathname === '/articles' ? 'active' : ''}>
                  <i className="fas fa-newspaper"></i>
                  <span>Articles</span>
                </Link>
              )}
              {canAccessPage('comments') && (
                <Link href="/comments" className={router.pathname === '/comments' ? 'active' : ''}>
                  <i className="fas fa-comments"></i>
                  <span>Comments</span>
                </Link>
              )}
            </div>
          )}
          
          {/* Business Operations */}
          {(canAccessPage('promotions') || canAccessPage('returns') || canAccessPage('store')) && (
            <div className="menu-section">
              <div className="section-title">Business Operations</div>
              {canAccessPage('promotions') && (
                <Link href="/promotions" className={router.pathname === '/promotions' ? 'active' : ''}>
                  <i className="fas fa-percentage"></i>
                  <span>Promotions</span>
                </Link>
              )}
              {canAccessPage('returns') && (
                <Link href="/returns" className={router.pathname === '/returns' ? 'active' : ''}>
                  <i className="fas fa-undo"></i>
                  <span>Returns</span>
                </Link>
              )}
              {canAccessPage('store') && (
                <Link href="/store" className={router.pathname === '/store' ? 'active' : ''}>
                  <i className="fas fa-store"></i>
                  <span>My Store</span>
                </Link>
              )}
            </div>
          )}
          
          {/* System Management */}
          {(canAccessPage('packages') || canAccessPage('shipping') || canAccessPage('sizes') || canAccessPage('taxes') || canAccessPage('settings')) && (
            <div className="menu-section">
              <div className="section-title">System Management</div>
              {canAccessPage('packages') && (
                <Link href="/packages" className={router.pathname === '/packages' ? 'active' : ''}>
                  <i className="fas fa-boxes"></i>
                  <span>Packages</span>
                </Link>
              )}
              {canAccessPage('shipping') && (
                <Link href="/shipping" className={router.pathname === '/shipping' ? 'active' : ''}>
                  <i className="fas fa-truck"></i>
                  <span>Shipping</span>
                </Link>
              )}
              {canAccessPage('sizes') && (
                <Link href="/sizes" className={router.pathname === '/sizes' ? 'active' : ''}>
                  <i className="fas fa-ruler"></i>
                  <span>Sizes</span>
                </Link>
              )}
              {canAccessPage('taxes') && (
                <Link href="/taxes" className={router.pathname === '/taxes' ? 'active' : ''}>
                  <i className="fas fa-calculator"></i>
                  <span>Taxes</span>
                </Link>
              )}
              {canAccessPage('settings') && (
                <Link href="/settings" className={router.pathname === '/settings' ? 'active' : ''}>
                  <i className="fas fa-cog"></i>
                  <span>System Settings</span>
                </Link>
              )}
            </div>
          )}
          
          {/* Platform Management - Super Admin Only */}
          {(canAccessPage('admin-admins') || canAccessPage('admin-users') || canAccessPage('admin-stores') || canAccessPage('admin-analytics')) && (
            <div className="menu-section">
              <div className="section-title">Platform Management</div>
              {canAccessPage('admin-admins') && (
                <Link href="/admin/admins" className={router.pathname === '/admin/admins' ? 'active' : ''}>
                  <i className="fas fa-user-tie"></i>
                  <span>All Admins</span>
                </Link>
              )}
              {canAccessPage('admin-users') && (
                <Link href="/admin/users" className={router.pathname === '/admin/users' ? 'active' : ''}>
                  <i className="fas fa-users-cog"></i>
                  <span>All Users</span>
                </Link>
              )}
              {canAccessPage('admin-stores') && (
                <Link href="/admin/stores" className={router.pathname === '/admin/stores' ? 'active' : ''}>
                  <i className="fas fa-building"></i>
                  <span>All Stores</span>
                </Link>
              )}
              {canAccessPage('admin-analytics') && (
                <Link href="/admin/analytics" className={router.pathname === '/admin/analytics' ? 'active' : ''}>
                  <i className="fas fa-chart-bar"></i>
                  <span>Platform Analytics</span>
                </Link>
              )}
            </div>
          )}
          
          {/* Monitoring - Super Admin Only */}
          {(canAccessPage('audit-logs') || canAccessPage('user-sessions') || canAccessPage('system-health')) && (
            <div className="menu-section">
              <div className="section-title">Monitoring</div>
              {canAccessPage('audit-logs') && (
                <Link href="/admin/audit-logs" className={router.pathname === '/admin/audit-logs' ? 'active' : ''}>
                  <i className="fas fa-clipboard-list"></i>
                  <span>Audit Logs</span>
                </Link>
              )}
              {canAccessPage('user-sessions') && (
                <Link href="/admin/user-sessions" className={router.pathname === '/admin/user-sessions' ? 'active' : ''}>
                  <i className="fas fa-desktop"></i>
                  <span>User Sessions</span>
                </Link>
              )}
              {canAccessPage('system-health') && (
                <Link href="/admin/system-health" className={router.pathname === '/admin/system-health' ? 'active' : ''}>
                  <i className="fas fa-heartbeat"></i>
                  <span>System Health</span>
                </Link>
              )}
            </div>
          )}
          
          {/* User Actions */}
          {user.isAuthenticated && (
            <div className="menu-section">
              <div className="section-title">Account</div>
              <Link href="/profile" className={router.pathname === '/profile' ? 'active' : ''}>
                <i className="fas fa-user"></i>
                <span>Profile</span>
              </Link>
              <Link href="/settings" className={router.pathname === '/settings' ? 'active' : ''}>
                <i className="fas fa-cog"></i>
                <span>Settings</span>
              </Link>
            </div>
          )}

          {/* Testing Pages - Admin & Super Admin Only */}
          {user.isAuthenticated && (isAdmin || isSuperAdmin) && (
            <div className="menu-section testing-section">
              <div className="section-title">Testing & Demos</div>
              <Link href="/test-permissions" className={router.pathname === '/test-permissions' ? 'active' : ''}>
                <i className="fas fa-shield-alt"></i>
                <span>Test Permissions</span>
                <span className="testing-badge">TEST</span>
              </Link>
              <Link href="/navigation-demo" className={router.pathname === '/navigation-demo' ? 'active' : ''}>
                <i className="fas fa-bars"></i>
                <span>Navigation Demo</span>
                <span className="testing-badge">DEMO</span>
              </Link>
              <Link href="/permission-demo" className={router.pathname === '/permission-demo' ? 'active' : ''}>
                <i className="fas fa-key"></i>
                <span>Permission Demo</span>
                <span className="testing-badge">DEMO</span>
              </Link>
              <Link href="/table-demo" className={router.pathname === '/table-demo' ? 'active' : ''}>
                <i className="fas fa-table"></i>
                <span>Table Demo</span>
                <span className="testing-badge">DEMO</span>
              </Link>
            </div>
          )}

          {/* Authentication */}
          <div className="menu-section">
            {user.isAuthenticated ? (
              <a href="#" style={{background: 'linear-gradient(135deg, color-mix(in srgb, var(--bs-danger) 15%, transparent) 0%, color-mix(in srgb, var(--bs-danger) 10%, transparent) 100%)', color: 'var(--bs-danger)', border: '1px solid color-mix(in srgb, var(--bs-danger) 30%, transparent)'}} onClick={(e) => {
    e.preventDefault(); 
    handleSignOut();
  }}>
                <i className="fas fa-sign-out-alt"></i>
                <span>Logout</span>
              </a>
            ) : (
              <>
                <Link href="/auth/signin" className={router.pathname === '/auth/signin' ? 'active' : ''}>
                  <i className="fas fa-sign-in-alt"></i>
                  <span>Login</span>
                </Link>
                <Link href="/auth/signup" className={router.pathname === '/auth/signup' ? 'active' : ''}>
                  <i className="fas fa-user-plus"></i>
                  <span>Register</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
