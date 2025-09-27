import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getNavigationItems, getAnonymousNavigationItems, getQuickActions, NavigationItem as NavigationItemType } from '@/config/navigation';
import { usePermissions } from '../../hooks/usePermissions';
import NavigationItem from '../NavigationItem';
import { useAppDispatch } from '@/store/store';
import { fetchCart } from '@/store/slices/cartSlice';
import { selectCartItemCount, selectCartIsLoading } from '@/store/slices/cartSelectors';
import { signOut } from '@/store/slices/userSlice';
import Swal from 'sweetalert2';
import Router from 'next/router';

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
  const { isAnonymous, userRoles, userPermissions, isSuperAdmin, isAdmin, hasActiveSubscription } = usePermissions();
  
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['main', 'user']));
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const cartCount = useSelector(selectCartItemCount);
  const cartLoading = useSelector(selectCartIsLoading);

  // Use anonymous navigation if user is not authenticated
  const userRole = userRoles?.[0]?.name || 'user';
  const navigationItems = isAnonymous() 
    ? getAnonymousNavigationItems() 
    : getNavigationItems(userRole, userPermissions || []);
  const quickActions = isAnonymous() ? [] : getQuickActions(userRole);


  // Fetch cart data using Redux dispatch
  useEffect(() => {
    if (user.isAuthenticated && !user.isGuest) {
      console.log('Navigation: Fetching cart for authenticated user:', user.id);
      dispatch(fetchCart());
    } else if (user.isGuest) {
      console.log('Navigation: User is in guest mode, not fetching cart');
    }
  }, [user.isAuthenticated, user.isGuest, user.id, dispatch]);

  // Organize navigation items into logical sections
  const navigationSections = useMemo((): NavigationSection[] => {
    if (isAnonymous()) {
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
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, sign out",
    });
    if (result.isConfirmed) {
      const response = await dispatch(signOut());
      if (response.meta.requestStatus === "fulfilled") {
        Router.push("/auth/signin");
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
      <div className={`navigation-container ${isOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
        {/* Navigation Header */}
        <div className="navigation-header">
          <div className="navigation-brand">
            <div className="navigation-logo">
              <i className="bi bi-shop"></i>
            </div>
            <div className="navigation-brand-text">
              <h3>YourLogo</h3>
              <span>Modern Platform</span>
            </div>
          </div>
          <button 
            className="navigation-close"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <i className="bi bi-x"></i>
          </button>
        </div>

        {/* User Info */}
        {user && (
          <div className="navigation-user-info">
            <div className="navigation-user-avatar">
              <i className="bi bi-person"></i>
            </div>
            <div className="navigation-user-details">
              <div className="navigation-user-name">{user.name}</div>
              <div className="navigation-user-role">
                {userRole}
                {isSuperAdmin() && (
                  <span className="navigation-role-badge navigation-role-badge-super-admin">
                    Super Admin
                  </span>
                )}
                {isAdmin() && !isSuperAdmin() && (
                  <span className="navigation-role-badge navigation-role-badge-admin">
                    Admin
                  </span>
                )}
                {hasActiveSubscription() && !isAdmin() && (
                  <span className="navigation-role-badge navigation-role-badge-subscribed">
                    Subscribed
                  </span>
                )}
                {!hasActiveSubscription() && !isAdmin() && (
                  <span className="navigation-role-badge navigation-role-badge-free">
                    Free User
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="navigation-search">
          <div className={`navigation-search-container ${isSearchFocused ? 'focused' : ''}`}>
            <i className="bi bi-search navigation-search-icon"></i>
            <input
              type="text"
              className="navigation-search-input"
              placeholder="Search navigation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            {searchQuery && (
              <button
                className="navigation-search-clear"
                onClick={() => setSearchQuery('')}
              >
                <i className="bi bi-x"></i>
              </button>
            )}
          </div>
        </div>

        {/* Main Navigation */}
        <div className="navigation-body">
          <div className="navigation-content">
            {filteredSections.map((section, index) => (
              <div key={section.title} className="navigation-section">
                {/* Section Header */}
                <div 
                  className={`navigation-section-header ${section.collapsible ? 'collapsible' : ''}`}
                  onClick={() => section.collapsible && toggleSection(section.title)}
                >
                  <div className="navigation-section-title">
                    {section.icon && <i className={`${section.icon} navigation-section-icon`}></i>}
                    {section.title}
                  </div>
                  {section.collapsible && (
                    <i className={`bi bi-chevron-${expandedSections.has(section.title) ? 'up' : 'down'} navigation-section-chevron`}></i>
                  )}
                </div>

                {/* Section Items */}
                {(!section.collapsible || expandedSections.has(section.title)) && (
                  <div className="navigation-section-items">
                    {section.items.map(item => (
                      <NavigationItem
                        key={item.key}
                        item={item}
                        level={0}
                        expandedItems={expandedItems}
                        onToggleExpanded={toggleExpanded}
                        renderBadge={renderBadge}
                        onClose={onClose}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* No results message */}
            {searchQuery && filteredSections.length === 0 && (
              <div className="navigation-empty-state">
                <i className="bi bi-search navigation-empty-state-icon"></i>
                <p className="navigation-empty-state-text">No results found for &quot;{searchQuery}&quot;</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        {quickActions.length > 0 && (
          <div className="navigation-quick-actions">
            <div className="navigation-quick-actions-title">Quick Actions</div>
            <div className="navigation-quick-actions-grid">
              {quickActions.slice(0, 4).map(action => (
                <Link
                  key={action.key}
                  href={action.href || '#'}
                  className="navigation-quick-action"
                  onClick={onClose}
                >
                  {action.icon && <i className={`${action.icon} navigation-quick-action-icon`}></i>}
                  <span className="navigation-quick-action-text">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* User Actions */}
        {user && (
          <div className="navigation-footer">
            <div className="navigation-user-actions">
              <Link href="/profile" className="navigation-user-action" onClick={onClose}>
                <i className="bi bi-person navigation-user-action-icon"></i>
                <span>Profile</span>
              </Link>
              <Link href="/settings" className="navigation-user-action" onClick={onClose}>
                <i className="bi bi-gear navigation-user-action-icon"></i>
                <span>Settings</span>
              </Link>
            </div>
            <button 
              className="navigation-logout"
              onClick={handleSignOut}
            >
              <i className="bi bi-box-arrow-right navigation-logout-icon"></i>
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Navigation;