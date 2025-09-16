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

// Anonymous user shopping routes (no authentication required)
export const getAnonymousNavigationItems = (): NavigationItem[] => [
  {
    key: 'home',
    label: 'Home',
    href: '/',
    icon: 'bi-house'
  },
  {
    key: 'about',
    label: 'About',
    href: '/about',
    icon: 'bi-info-circle'
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
    badge: 'cart-count'
  },
  {
    key: 'product-details',
    label: 'Product Details',
    href: '/shop/product/[id]',
    icon: 'bi-eye'
  },
  {
    key: 'categories',
    label: 'Categories',
    href: '/categories',
    icon: 'bi-tags'
  }
];

export const getNavigationItems = (userRole: string, permissions: string[]): NavigationItem[] => {
  // Base shopping routes for all users
  const baseItems: NavigationItem[] = [
    {
      key: 'home',
      label: 'Home',
      href: '/',
      icon: 'bi-house'
    },
    {
      key: 'about',
      label: 'About',
      href: '/about',
      icon: 'bi-info-circle'
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
      badge: 'cart-count'
    }
  ];

  // Normal user shopping routes only
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
    },
    {
      key: 'user-orders',
      label: 'Order History',
      href: '/orders/user',
      icon: 'bi-clock-history'
    }
  ];

  // Admin (tenant) - manages their own system
  const adminItems: NavigationItem[] = [
    {
      key: 'admin-dashboard',
      label: 'My Dashboard',
      href: '/dashboard',
      icon: 'bi-speedometer2'
    },
    {
      key: 'user-management',
      label: 'My Users',
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
          key: 'role-assignment',
          label: 'Role Assignment',
          href: '/roles/Assignment',
          icon: 'bi-person-gear'
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
      label: 'My Content',
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
          href: '/shop',
          icon: 'bi-box'
        },
        {
          key: 'articles',
          label: 'Articles',
          href: '/articles',
          icon: 'bi-newspaper'
        },
        {
          key: 'comments',
          label: 'Comments',
          href: '/comments',
          icon: 'bi-chat-dots'
        }
      ]
    },
    {
      key: 'business-management',
      label: 'My Business',
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
        },
        {
          key: 'my-store',
          label: 'My Store',
          href: '/store',
          icon: 'bi-shop-window'
        }
      ]
    },
    {
      key: 'system-management',
      label: 'My System',
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
      key: 'payment-management',
      label: 'Payment',
      icon: 'bi-credit-card',
      children: [
        {
          key: 'payment-checkout',
          label: 'Payment Checkout',
          href: '/payment/checkoutwithstripe',
          icon: 'bi-credit-card-2-front'
        }
      ]
    }
  ];

  // Super Admin - controls everything
  const superAdminItems: NavigationItem[] = [
    {
      key: 'super-dashboard',
      label: 'Super Admin Dashboard',
      href: '/dashboard',
      icon: 'bi-speedometer2'
    },
    {
      key: 'platform-management',
      label: 'Platform Management',
      icon: 'bi-globe',
      children: [
        {
          key: 'all-admins',
          label: 'All Admins',
          href: '/admin/admins',
          icon: 'bi-person-badge'
        },
        {
          key: 'all-users',
          label: 'All Users',
          href: '/admin/users',
          icon: 'bi-people'
        },
        {
          key: 'all-stores',
          label: 'All Stores',
          href: '/admin/stores',
          icon: 'bi-shop-window'
        },
        {
          key: 'platform-analytics',
          label: 'Platform Analytics',
          href: '/admin/analytics',
          icon: 'bi-graph-up'
        }
      ]
    },
    {
      key: 'tenant-management',
      label: 'Tenant Management',
      icon: 'bi-building',
      children: [
        {
          key: 'tenant-dashboards',
          label: 'Tenant Dashboards',
          href: '/admin/tenant-dashboards',
          icon: 'bi-speedometer2'
        },
        {
          key: 'tenant-users',
          label: 'Tenant Users',
          href: '/admin/tenant-users',
          icon: 'bi-person-lines-fill'
        },
        {
          key: 'tenant-orders',
          label: 'Tenant Orders',
          href: '/admin/tenant-orders',
          icon: 'bi-bag'
        },
        {
          key: 'tenant-products',
          label: 'Tenant Products',
          href: '/admin/tenant-products',
          icon: 'bi-box'
        }
      ]
    },
    {
      key: 'system-management',
      label: 'System Management',
      icon: 'bi-gear',
      children: [
        {
          key: 'roles-permissions',
          label: 'Roles & Permissions',
          href: '/admin/roles-permissions',
          icon: 'bi-shield-check'
        },
        {
          key: 'system-settings',
          label: 'System Settings',
          href: '/admin/settings',
          icon: 'bi-gear'
        },
        {
          key: 'billing-management',
          label: 'Billing Management',
          href: '/admin/billing',
          icon: 'bi-credit-card'
        }
      ]
    },
    {
      key: 'monitoring',
      label: 'Monitoring',
      icon: 'bi-activity',
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
        },
        {
          key: 'system-health',
          label: 'System Health',
          href: '/admin/system-health',
          icon: 'bi-heart-pulse'
        }
      ]
    }
  ];

  // Combine items based on user role
  let items = [...baseItems];

  if (userRole === 'super_admin') {
    items = [...items, ...superAdminItems];
  } else if (userRole === 'admin') {
    items = [...items, ...adminItems];
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
    super_admin: [
      { key: 'create-admin', label: 'Create Admin', href: '/admin/admins/create', icon: 'bi-person-badge' },
      { key: 'view-platform-analytics', label: 'Platform Analytics', href: '/admin/analytics', icon: 'bi-graph-up' },
      { key: 'manage-tenants', label: 'Manage Tenants', href: '/admin/tenant-dashboards', icon: 'bi-building' },
      { key: 'system-health', label: 'System Health', href: '/admin/system-health', icon: 'bi-heart-pulse' },
      { key: 'audit-logs', label: 'Audit Logs', href: '/admin/audit-logs', icon: 'bi-file-text' }
    ],
    admin: [
      { key: 'create-user', label: 'Create User', href: '/users/create', icon: 'bi-person-plus' },
      { key: 'create-category', label: 'Create Category', href: '/categories/create', icon: 'bi-tag-plus' },
      { key: 'create-product', label: 'Create Product', href: '/shop/product/create', icon: 'bi-box-plus' },
      { key: 'create-article', label: 'Create Article', href: '/articles/create', icon: 'bi-newspaper' },
      { key: 'create-promotion', label: 'Create Promotion', href: '/promotions/create', icon: 'bi-percent' },
      { key: 'view-analytics', label: 'My Analytics', href: '/analytics', icon: 'bi-graph-up' },
      { key: 'manage-store', label: 'Manage Store', href: '/store', icon: 'bi-shop-window' }
    ],
    user: [
      { key: 'browse-products', label: 'Browse Products', href: '/shop', icon: 'bi-shop' },
      { key: 'view-orders', label: 'My Orders', href: '/orders', icon: 'bi-bag' },
      { key: 'view-favorites', label: 'My Favorites', href: '/favorites', icon: 'bi-heart' },
      { key: 'checkout', label: 'Checkout', href: '/payment/checkoutwithstripe', icon: 'bi-credit-card' }
    ]
  };

  return actions[userRole] || [];
};
