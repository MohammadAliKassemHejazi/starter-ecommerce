import React from 'react';
import { TableAction } from './ModernTable';

interface TableActionsProps<T = any> {
  actions: TableAction<T>[];
  row: T;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const TableActions = <T extends Record<string, any>>({
  actions,
  row,
  className = '',
  size = 'sm'
}: TableActionsProps<T>) => {
  const visibleActions = actions.filter(action => 
    !action.show || action.show(row)
  );

  if (visibleActions.length === 0) {
    return null;
  }

  const getButtonSize = () => {
    switch (size) {
      case 'sm': return 'btn-sm';
      case 'lg': return 'btn-lg';
      default: return '';
    }
  };

  const getVariantClass = (variant: string = 'primary') => {
    return `btn-${variant}`;
  };

  return (
    <div className={`table-actions d-flex gap-1 ${className}`}>
      {visibleActions.map((action) => (
        <button
          key={action.key}
          className={`btn ${getVariantClass(action.variant)} ${getButtonSize()} ${action.className || ''}`}
          onClick={(e) => {
            e.stopPropagation();
            action.onClick(row);
          }}
          title={action.label}
          style={{
            minWidth: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.25rem 0.5rem'
          }}
        >
          {action.icon && (
            <i className={`${action.icon} ${action.label ? 'me-1' : ''}`}></i>
          )}
          {action.label && (
            <span className="d-none d-md-inline">{action.label}</span>
          )}
        </button>
      ))}
    </div>
  );
};

export default TableActions;
