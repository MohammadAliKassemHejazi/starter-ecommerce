import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { usePermissions } from '@/hooks/usePermissions';
import { NavigationItem as NavigationItemType } from '@/config/navigation';

interface NavigationItemProps {
  item: NavigationItemType;
  level?: number;
  onClose?: () => void;
  expandedItems?: Set<string>;
  onToggleExpanded?: (key: string) => void;
  renderBadge?: (badge: string | number) => React.ReactNode;
}

// Client-side only component that uses hooks
const ClientNavigationItem: React.FC<NavigationItemProps> = ({
  item,
  level = 0,
  onClose,
  expandedItems = new Set(),
  onToggleExpanded,
  renderBadge
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { hasRole, hasPermission, hasAnyRole, hasAnyPermission } = usePermissions();

  // Check if user has access to this item
  const hasAccess = () => {
    // Check roles
    if (item.roles && item.roles.length > 0) {
      if (!hasAnyRole(item.roles)) {
        return false;
      }
    }

    // Check permissions
    if (item.permissions && item.permissions.length > 0) {
      if (!hasAnyPermission(item.permissions)) {
        return false;
      }
    }

    return true;
  };

  // Don't render if user doesn't have access
  if (!hasAccess()) {
    return null;
  }

  const isItemActive = router.pathname === item.href || router.pathname.startsWith(item.href + '/');
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expandedItems.has(item.key);

  const renderBadgeLocal = (badge: string | number) => {
    if (renderBadge) {
      return renderBadge(badge);
    }
    if (badge === 'cart-count') {
      // This would be handled by the parent component
      return null;
    }
    return (
      <span className="navigation-badge navigation-badge-primary">
        {badge}
      </span>
    );
  };

  const handleClick = () => {
    if (hasChildren && onToggleExpanded) {
      onToggleExpanded(item.key);
    } else if (onClose) {
      onClose();
    }
  };

  const getItemIcon = () => {
    if (item.icon) {
      return <i className={`${item.icon} me-2`}></i>;
    }
    return null;
  };

  const getItemLabel = () => {
    const translationKey = `navigation.${item.label.toLowerCase().replace(/\s+/g, '')}`;
    return t(translationKey) || item.label;
  };

  return (
    <li className={`navigation-item ${level > 0 ? 'ms-3' : ''}`}>
      {hasChildren ? (
        <>
          <button
            className={`navigation-link ${level > 0 ? 'navigation-link-sub' : ''} ${
              isItemActive ? 'active' : ''
            }`}
            onClick={handleClick}
            aria-expanded={isExpanded}
          >
            <span className="navigation-link-content">
              {getItemIcon()}
              <span className="navigation-link-text">{getItemLabel()}</span>
            </span>
            <i className={`bi bi-chevron-${isExpanded ? 'up' : 'down'} navigation-chevron ${isExpanded ? 'expanded' : ''}`}></i>
          </button>
          {isExpanded && item.children && (
            <ul className="nav flex-column ms-2 mt-1">
              {item.children.map((child) => (
                <NavigationItem
                  key={child.key}
                  item={child}
                  level={level + 1}
                  onClose={onClose}
                  expandedItems={expandedItems}
                  onToggleExpanded={onToggleExpanded}
                />
              ))}
            </ul>
          )}
        </>
      ) : (
        <Link
          href={item.href || '#'}
          className={`navigation-link ${level > 0 ? 'navigation-link-sub' : ''} ${
            isItemActive ? 'active' : ''
          }`}
          onClick={onClose}
        >
          <span className="navigation-link-content">
            {getItemIcon()}
            <span className="navigation-link-text">{getItemLabel()}</span>
          </span>
          {item.badge && (
            <span className="navigation-link-badge">{renderBadgeLocal(item.badge)}</span>
          )}
        </Link>
      )}
    </li>
  );
};

// Main component that handles client-side rendering
const NavigationItem: React.FC<NavigationItemProps> = (props) => {
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render anything on server side
  if (!isClient) {
    return null;
  }

  // Render the client-side component
  return <ClientNavigationItem {...props} />;
};

export default NavigationItem;