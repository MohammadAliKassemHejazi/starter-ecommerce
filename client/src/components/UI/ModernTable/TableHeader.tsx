import React from 'react';

interface TableHeaderProps {
  searchable?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  actions?: React.ReactNode;
  totalItems?: number;
  className?: string;
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  searchable = true,
  searchPlaceholder = 'Search...',
  searchValue = '',
  onSearchChange,
  actions,
  totalItems,
  className = ''
}) => {
  return (
    <div className={`table-header mb-4 ${className}`}>
      <div className="row align-items-center">
        <div className="col-md-6">
          {searchable && (
            <div className="search-container">
              <div className="input-group">
                <span className="input-group-text border-end-0" style={{ background: 'var(--bs-component-bg)' }}>
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  style={{
                    boxShadow: 'none',
                    borderLeft: 'none'
                  }}
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="col-md-6">
          <div className="d-flex justify-content-end align-items-center gap-3">
            {totalItems !== undefined && (
              <div className="text-muted small">
                <i className="bi bi-list-ul me-1"></i>
                {totalItems.toLocaleString()} items
              </div>
            )}
            {actions && (
              <div className="header-actions">
                {actions}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableHeader;
