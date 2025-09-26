import React from 'react';

interface FilterCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  onClear?: () => void;
  showClearButton?: boolean;
}

export const FilterCard: React.FC<FilterCardProps> = ({
  title = 'Filters',
  children,
  className = '',
  onClear,
  showClearButton = true
}) => {
  return (
    <div className={`card mb-4 ${className}`}>
      <div className="card-header d-flex justify-content-between align-items-center">
        <h6 className="mb-0">{title}</h6>
        {showClearButton && onClear && (
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={onClear}
          >
            <i className="bi bi-x-circle me-1"></i>
            Clear
          </button>
        )}
      </div>
      <div className="card-body">
        {children}
      </div>
    </div>
  );
};

export default FilterCard;
