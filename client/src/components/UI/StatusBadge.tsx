import React from 'react';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'custom';
  customVariant?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showIcon?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant = 'default',
  customVariant,
  size = 'md',
  className = '',
  showIcon = false
}) => {
  const getStatusConfig = (status: string) => {
    const statusLower = status.toLowerCase();
    
    // Common status mappings
    const statusMap: { [key: string]: { color: string; icon?: string; label: string } } = {
      // General statuses
      'active': { color: 'success', icon: 'bi-check-circle', label: 'Active' },
      'inactive': { color: 'secondary', icon: 'bi-x-circle', label: 'Inactive' },
      'pending': { color: 'warning', icon: 'bi-clock', label: 'Pending' },
      'approved': { color: 'success', icon: 'bi-check-circle', label: 'Approved' },
      'rejected': { color: 'danger', icon: 'bi-x-circle', label: 'Rejected' },
      'completed': { color: 'success', icon: 'bi-check-circle', label: 'Completed' },
      'cancelled': { color: 'danger', icon: 'bi-x-circle', label: 'Cancelled' },
      'processing': { color: 'info', icon: 'bi-gear', label: 'Processing' },
      'shipped': { color: 'info', icon: 'bi-truck', label: 'Shipped' },
      'delivered': { color: 'success', icon: 'bi-check-circle', label: 'Delivered' },
      'draft': { color: 'secondary', icon: 'bi-file-text', label: 'Draft' },
      'published': { color: 'success', icon: 'bi-globe', label: 'Published' },
      'archived': { color: 'secondary', icon: 'bi-archive', label: 'Archived' },
      
      // Order statuses
      'order_pending': { color: 'warning', icon: 'bi-clock', label: 'Pending' },
      'order_confirmed': { color: 'info', icon: 'bi-check-circle', label: 'Confirmed' },
      'order_shipped': { color: 'primary', icon: 'bi-truck', label: 'Shipped' },
      'order_delivered': { color: 'success', icon: 'bi-check-circle', label: 'Delivered' },
      'order_cancelled': { color: 'danger', icon: 'bi-x-circle', label: 'Cancelled' },
      'order_returned': { color: 'warning', icon: 'bi-arrow-return-left', label: 'Returned' },
      
      // Payment statuses
      'payment_pending': { color: 'warning', icon: 'bi-clock', label: 'Pending' },
      'payment_completed': { color: 'success', icon: 'bi-check-circle', label: 'Completed' },
      'payment_failed': { color: 'danger', icon: 'bi-x-circle', label: 'Failed' },
      'payment_refunded': { color: 'info', icon: 'bi-arrow-return-left', label: 'Refunded' },
      
      // User statuses
      'user_active': { color: 'success', icon: 'bi-person-check', label: 'Active' },
      'user_inactive': { color: 'secondary', icon: 'bi-person-x', label: 'Inactive' },
      'user_suspended': { color: 'danger', icon: 'bi-person-x', label: 'Suspended' },
      'user_verified': { color: 'success', icon: 'bi-shield-check', label: 'Verified' },
      'user_unverified': { color: 'warning', icon: 'bi-shield-exclamation', label: 'Unverified' },
      
      // Product statuses
      'product_active': { color: 'success', icon: 'bi-check-circle', label: 'Active' },
      'product_inactive': { color: 'secondary', icon: 'bi-x-circle', label: 'Inactive' },
      'product_out_of_stock': { color: 'danger', icon: 'bi-exclamation-triangle', label: 'Out of Stock' },
      'product_low_stock': { color: 'warning', icon: 'bi-exclamation-triangle', label: 'Low Stock' },
      'product_discontinued': { color: 'secondary', icon: 'bi-x-circle', label: 'Discontinued' },
      
      // Promotion statuses
      'promotion_active': { color: 'success', icon: 'bi-percent', label: 'Active' },
      'promotion_inactive': { color: 'secondary', icon: 'bi-x-circle', label: 'Inactive' },
      'promotion_expired': { color: 'danger', icon: 'bi-clock', label: 'Expired' },
      'promotion_scheduled': { color: 'info', icon: 'bi-calendar', label: 'Scheduled' },
      
      // Return statuses
      'return_pending': { color: 'warning', icon: 'bi-clock', label: 'Pending' },
      'return_approved': { color: 'success', icon: 'bi-check-circle', label: 'Approved' },
      'return_rejected': { color: 'danger', icon: 'bi-x-circle', label: 'Rejected' },
      'return_processed': { color: 'info', icon: 'bi-gear', label: 'Processed' },
    };

    return statusMap[statusLower] || statusMap[status] || {
      color: 'secondary',
      icon: 'bi-circle',
      label: status
    };
  };

  const config = getStatusConfig(status);
  const color = variant === 'custom' && customVariant ? customVariant : config.color;
  const sizeClass = size === 'sm' ? 'badge-sm' : size === 'lg' ? 'badge-lg' : '';

  return (
    <span className={`badge bg-${color} ${sizeClass} ${className}`}>
      {showIcon && config.icon && (
        <i className={`${config.icon} me-1`}></i>
      )}
      {config.label}
    </span>
  );
};

export default StatusBadge;
