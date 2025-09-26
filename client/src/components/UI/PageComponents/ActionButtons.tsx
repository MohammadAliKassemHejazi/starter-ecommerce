import React from 'react';
import { useRouter } from 'next/router';

interface ActionButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'outline-primary' | 'outline-secondary';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  label: string;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  className?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  label,
  onClick,
  href,
  disabled = false,
  className = ''
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    } else if (onClick) {
      onClick();
    }
  };

  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
  const buttonClass = `btn btn-${variant} ${sizeClass} d-flex align-items-center ${className}`;

  return (
    <button
      className={buttonClass}
      onClick={handleClick}
      disabled={disabled}
    >
      {icon && <i className={`${icon} me-2`}></i>}
      {label}
    </button>
  );
};

interface ActionGroupProps {
  actions: ActionButtonProps[];
  className?: string;
}

export const ActionGroup: React.FC<ActionGroupProps> = ({
  actions,
  className = ''
}) => {
  return (
    <div className={`d-flex gap-2 ${className}`}>
      {actions.map((action, index) => (
        <ActionButton key={index} {...action} />
      ))}
    </div>
  );
};

// Common action presets
export const createActionButtons = {
  add: (href: string, label: string = 'Add New') => ({
    variant: 'primary' as const,
    icon: 'bi bi-plus-circle',
    label,
    href
  }),
  
  edit: (href: string, label: string = 'Edit') => ({
    variant: 'primary' as const,
    icon: 'bi bi-pencil',
    label,
    href
  }),
  
  delete: (onClick: () => void, label: string = 'Delete') => ({
    variant: 'danger' as const,
    icon: 'bi bi-trash',
    label,
    onClick
  }),
  
  view: (href: string, label: string = 'View') => ({
    variant: 'info' as const,
    icon: 'bi bi-eye',
    label,
    href
  }),
  
  export: (onClick: () => void, label: string = 'Export') => ({
    variant: 'outline-secondary' as const,
    icon: 'bi bi-download',
    label,
    onClick
  }),
  
  filter: (onClick: () => void, label: string = 'Filter') => ({
    variant: 'outline-secondary' as const,
    icon: 'bi bi-funnel',
    label,
    onClick
  }),
  
  settings: (onClick: () => void, label: string = 'Settings') => ({
    variant: 'outline-secondary' as const,
    icon: 'bi bi-gear',
    label,
    onClick
  })
};

export default ActionButton;
