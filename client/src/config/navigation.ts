import { usePermissions } from '@/hooks/usePermissions';

export interface NavigationItem {
  key: string;
  label: string;
  href?: string;
  icon?: string;
  children?: NavigationItem[];
  roles?: string[];
  permissions?: string[];
  badge?: string | number;
  divider?: boolean;
}

export const getNavigationItems = (userRole: string, permissions: string[]): NavigationItem[] => {
  const baseItems: NavigationItem[] = [
    {
      key: 'home',
      label: 'Home',
      href: '/',
      icon: 'bi-house'
    },
    {
      key: 'shop',
      label: 'Shop',
      href: '/shop',
      icon: 'bi-shop'
    },
    {
      key: 'cart',
      label: 'Cart',
      href: '/cart',
      icon: 'bi-cart',
      badge: 'cart-count' // This would be dynamically updated
    }
  ];

  const userItems: NavigationItem[] = [
    {
      key: 'favorites',
      label: 'Favorites',
      href: '/favorites',
      icon: 'bi-heart'
    },
    {
      key: 'orders',
      label: 'My Orders',
      href: '/orders',
      icon: 'bi-bag'
    }
  ];

  const vendorItems: NavigationItem[] = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      href: '/dashboard',
      icon: 'bi-speedometer2'
    },
    {
      key: 'my-store',
      label: 'My Store',
      href: '/store',
      icon: 'bi-shop-window'
    },
    {
      key: 'products',
      label: 'Products',
      href: '/products',
      icon: 'bi-box'
    },
    {
      key: 'orders-management',
      label: 'Orders',
      href: '/orders',
      icon: 'bi-bag'
    }
  ];

  const adminItems: NavigationItem[] = [
    {
      key: 'admin-dashboard',
      label: 'Admin Dashboard',
      href: '/dashboard',
      icon: 'bi-speedometer2'
    },
    {
      key: 'user-management',
      label: 'User Management',
      icon: 'bi-people',
      children: [
        {
          key: 'users',
          label: 'Users',
          href: '/users',
          icon: 'bi-person'
        },
        {
          key: 'roles',
          label: 'Roles',
          href: '/roles',
          icon: 'bi-person-badge'
        },
        {
          key: 'permissions',
          label: 'Permissions',
          href: '/permissions',
          icon: 'bi-shield-check'
        }
      ]
    },
    {
      key: 'content-management',
      label: 'Content Management',
      icon: 'bi-folder',
      children: [
        {
          key: 'categories',
          label: 'Categories',
          href: '/categories',
          icon: 'bi-tags'
        },
        {
          key: 'subcategories',
          label: 'Subcategories',
          href: '/subcategories',
          icon: 'bi-tag'
        },
        {
          key: 'products-admin',
          label: 'Products',
          href: '/products',
          icon: 'bi-box'
        },
        {
          key: 'articles',
          label: 'Articles',
          href: '/articles',
          icon: 'bi-newspaper'
        }
      ]
    },
    {
      key: 'business-management',
      label: 'Business Management',
      icon: 'bi-briefcase',
      children: [
        {
          key: 'orders-admin',
          label: 'Orders',
          href: '/orders',
          icon: 'bi-bag'
        },
        {
          key: 'promotions',
          label: 'Promotions',
          href: '/promotions',
          icon: 'bi-percent'
        },
        {
          key: 'analytics',
          label: 'Analytics',
          href: '/analytics',
          icon: 'bi-graph-up'
        },
        {
          key: 'returns',
          label: 'Returns',
          href: '/returns',
          icon: 'bi-arrow-return-left'
        }
      ]
    },
    {
      key: 'system-management',
      label: 'System Management',
      icon: 'bi-gear',
      children: [
        {
          key: 'packages',
          label: 'Packages',
          href: '/packages',
          icon: 'bi-box-seam'
        },
        {
          key: 'shipping',
          label: 'Shipping',
          href: '/shipping',
          icon: 'bi-truck'
        },
        {
          key: 'sizes',
          label: 'Sizes',
          href: '/sizes',
          icon: 'bi-rulers'
        },
        {
          key: 'taxes',
          label: 'Taxes',
          href: '/taxes',
          icon: 'bi-calculator'
        }
      ]
    },
    {
      key: 'system-logs',
      label: 'System Logs',
      icon: 'bi-journal-text',
      children: [
        {
          key: 'audit-logs',
          label: 'Audit Logs',
          href: '/admin/audit-logs',
          icon: 'bi-file-text'
        },
        {
          key: 'user-sessions',
          label: 'User Sessions',
          href: '/admin/user-sessions',
          icon: 'bi-person-lines-fill'
        }
      ]
    }
  ];

  // Combine items based on user role
  let items = [...baseItems];

  if (userRole === 'admin') {
    items = [...items, ...adminItems];
  } else if (userRole === 'vendor') {
    items = [...items, ...vendorItems];
  } else {
    items = [...items, ...userItems];
  }

  // Filter items based on permissions
  return items.filter(item => {
    if (item.roles && !item.roles.includes(userRole)) {
      return false;
    }
    if (item.permissions && !item.permissions.some(permission => permissions.includes(permission))) {
      return false;
    }
    return true;
  });
};

export const getQuickActions = (userRole: string): NavigationItem[] => {
  const actions: { [key: string]: NavigationItem[] } = {
    admin: [
      { key: 'create-user', label: 'Create User', href: '/users/create', icon: 'bi-person-plus' },
      { key: 'create-category', label: 'Create Category', href: '/categories/create', icon: 'bi-tag-plus' },
      { key: 'create-product', label: 'Create Product', href: '/products/create', icon: 'bi-box-plus' },
      { key: 'view-analytics', label: 'View Analytics', href: '/analytics', icon: 'bi-graph-up' }
    ],
    vendor: [
      { key: 'create-product', label: 'Add Product', href: '/products/create', icon: 'bi-box-plus' },
      { key: 'view-orders', label: 'View Orders', href: '/orders', icon: 'bi-bag' },
      { key: 'view-dashboard', label: 'Dashboard', href: '/dashboard', icon: 'bi-speedometer2' }
    ],
    user: [
      { key: 'browse-products', label: 'Browse Products', href: '/shop', icon: 'bi-shop' },
      { key: 'view-orders', label: 'My Orders', href: '/orders', icon: 'bi-bag' },
      { key: 'view-favorites', label: 'My Favorites', href: '/favorites', icon: 'bi-heart' }
    ]
  };

  return actions[userRole] || [];
};
