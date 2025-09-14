import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getNavigationItems, getQuickActions, NavigationItem } from '@/config/navigation';
import { usePermissions } from '@/hooks/usePermissions';
import LanguageSwitcher from '../LanguageSwitcher';

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const user = useSelector((state: any) => state.user.user);
  const { isAdmin, isVendor, hasPermission } = usePermissions();
  
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [cartCount, setCartCount] = useState(0);

  const userRole = user?.role || 'user';
  const navigationItems = getNavigationItems(userRole, user?.permissions || []);
  const quickActions = getQuickActions(userRole);

  useEffect(() => {
    // Fetch cart count
    const fetchCartCount = async () => {
      try {
        const response = await fetch('/api/cart');
        if (response.ok) {
          const data = await response.json();
          setCartCount(data.data?.items?.length || 0);
        }
      } catch (error) {
        console.error('Error fetching cart count:', error);
      }
    };

    if (user) {
      fetchCartCount();
    }
  }, [user]);

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

  const isActive = (href: string) => {
    return router.pathname === href || router.pathname.startsWith(href + '/');
  };

  const renderBadge = (badge: string | number) => {
    if (badge === 'cart-count') {
      return cartCount > 0 ? (
        <span className="badge bg-primary rounded-pill position-absolute top-0 start-100 translate-middle">
          {cartCount}
        </span>
      ) : null;
    }
    return (
      <span className="badge bg-primary rounded-pill">
        {badge}
      </span>
    );
  };

  const renderNavigationItem = (item: NavigationItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.key);
    const isItemActive = item.href ? isActive(item.href) : false;

    return (
      <li key={item.key} className={`nav-item ${level > 0 ? 'ms-3' : ''}`}>
        {hasChildren ? (
          <>
            <button
              className={`nav-link d-flex align-items-center justify-content-between w-100 text-start ${
                isExpanded ? 'active' : ''
              }`}
              onClick={() => toggleExpanded(item.key)}
            >
              <span>
                {item.icon && <i className={`${item.icon} me-2`}></i>}
                {t(`navigation.${item.label.toLowerCase().replace(/\s+/g, '')}`) || item.label}
              </span>
              <i className={`bi bi-chevron-${isExpanded ? 'up' : 'down'}`}></i>
            </button>
            {isExpanded && (
              <ul className="nav flex-column ms-3">
                {item.children?.map(child => renderNavigationItem(child, level + 1))}
              </ul>
            )}
          </>
        ) : (
          <Link
            href={item.href || '#'}
            className={`nav-link d-flex align-items-center justify-content-between ${
              isItemActive ? 'active' : ''
            }`}
            onClick={onClose}
          >
            <span>
              {item.icon && <i className={`${item.icon} me-2`}></i>}
              {t(`navigation.${item.label.toLowerCase().replace(/\s+/g, '')}`) || item.label}
            </span>
            {item.badge && renderBadge(item.badge)}
          </Link>
        )}
      </li>
    );
  };

  if (!isOpen) { return null };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="offcanvas-backdrop fade show" 
        onClick={onClose}
        style={{ zIndex: 1040 }}
      ></div>
      
      {/* Navigation Panel */}
      <div 
        className="offcanvas offcanvas-start show" 
        style={{ zIndex: 1045 }}
        tabIndex={-1}
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="offcanvas-title fw-bold">
            {user ? `${t('common.welcome')}, ${user.name}` : t('navigation.menu')}
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            aria-label="Close"
          ></button>
        </div>
        
        <div className="offcanvas-body p-0">
          {/* User Info */}
          {user && (
            <div className="p-3 bg-light border-bottom">
              <div className="d-flex align-items-center">
                <div className="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                     style={{ width: '40px', height: '40px' }}>
                  <i className="bi bi-person"></i>
                </div>
                <div className="flex-grow-1">
                  <div className="fw-semibold">{user.name}</div>
                  <small className="text-muted text-capitalize">{user.role}</small>
                </div>
              </div>
            </div>
          )}

          {/* Language Switcher */}
          <div className="p-3 border-bottom">
            <LanguageSwitcher />
          </div>

          {/* Main Navigation */}
          <nav className="p-3">
            <ul className="nav flex-column">
              {navigationItems.map(item => renderNavigationItem(item))}
            </ul>
          </nav>

          {/* Quick Actions */}
          {quickActions.length > 0 && (
            <div className="p-3 border-top">
              <h6 className="text-muted text-uppercase small fw-semibold mb-3">
                {t('navigation.quickActions')}
              </h6>
              <div className="d-grid gap-2">
                {quickActions.map(action => (
                  <Link
                    key={action.key}
                    href={action.href || '#'}
                    className="btn btn-outline-primary btn-sm d-flex align-items-center"
                    onClick={onClose}
                  >
                    {action.icon && <i className={`${action.icon} me-2`}></i>}
                    {action.label}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* User Actions */}
          {user && (
            <div className="p-3 border-top">
              <div className="d-grid gap-2">
                <Link
                  href="/profile"
                  className="btn btn-outline-secondary btn-sm d-flex align-items-center"
                  onClick={onClose}
                >
                  <i className="bi bi-person me-2"></i>
                  {t('navigation.profile')}
                </Link>
                <Link
                  href="/settings"
                  className="btn btn-outline-secondary btn-sm d-flex align-items-center"
                  onClick={onClose}
                >
                  <i className="bi bi-gear me-2"></i>
                  {t('navigation.settings')}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navigation;
