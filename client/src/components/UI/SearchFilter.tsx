import React, { useState, useEffect } from 'react';

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface SearchFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters?: {
    [key: string]: {
      label: string;
      options: FilterOption[];
      value: string;
      onChange: (value: string) => void;
    };
  };
  sortOptions?: {
    value: string;
    label: string;
  }[];
  sortValue?: string;
  onSortChange?: (value: string) => void;
  showClearButton?: boolean;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  searchValue,
  onSearchChange,
  filters = {},
  sortOptions = [],
  sortValue = '',
  onSortChange,
  showClearButton = true,
  onClear,
  placeholder = 'Search...',
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  useEffect(() => {
    const count = Object.values(filters).filter(filter => filter.value).length;
    setActiveFiltersCount(count);
  }, [filters]);

  const handleClear = () => {
    onSearchChange('');
    Object.values(filters).forEach(filter => filter.onChange(''));
    if (onSortChange) {
      onSortChange('');
    }
    if (onClear) {
      onClear();
    }
  };

  const hasActiveFilters = activeFiltersCount > 0 || searchValue || sortValue;

  return (
    <div className={`search-filter ${className}`}>
      {/* Search Bar */}
      <div className="row mb-3">
        <div className="col-md-8">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder={placeholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {showClearButton && hasActiveFilters && (
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={handleClear}
                title="Clear all filters"
              >
                <i className="bi bi-x"></i>
              </button>
            )}
          </div>
        </div>
        <div className="col-md-4">
          <div className="d-flex gap-2">
            {sortOptions.length > 0 && onSortChange && (
              <select
                className="form-select"
                value={sortValue}
                onChange={(e) => onSortChange(e.target.value)}
              >
                <option value="">Sort by...</option>
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
            {Object.keys(filters).length > 0 && (
              <button
                className={`btn btn-outline-primary ${isExpanded ? 'active' : ''}`}
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <i className="bi bi-funnel me-1"></i>
                Filters
                {activeFiltersCount > 0 && (
                  <span className="badge bg-primary ms-1">{activeFiltersCount}</span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {isExpanded && Object.keys(filters).length > 0 && (
        <div className="card mb-3">
          <div className="card-body">
            <div className="row">
              {Object.entries(filters).map(([key, filter]) => (
                <div key={key} className="col-md-3 mb-3">
                  <label className="form-label fw-semibold">{filter.label}</label>
                  <select
                    className="form-select"
                    value={filter.value}
                    onChange={(e) => filter.onChange(e.target.value)}
                  >
                    <option value="">All {filter.label}</option>
                    {filter.options.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                        {option.count !== undefined && ` (${option.count})`}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <div className="d-flex justify-content-end">
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={handleClear}
              >
                <i className="bi bi-arrow-clockwise me-1"></i>
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mb-3">
          <div className="d-flex flex-wrap gap-2">
            {searchValue && (
              <span className="badge bg-primary d-flex align-items-center">
                Search: &quot;{searchValue}&quot;
                <button
                  className="btn-close btn-close-white ms-2"
                  style={{ fontSize: '0.7em' }}
                  onClick={() => onSearchChange('')}
                ></button>
              </span>
            )}
            {Object.entries(filters).map(([key, filter]) => {
              if (!filter.value) {
                return null;
              }
              const option = filter.options.find(opt => opt.value === filter.value);
              return (
                <span key={key} className="badge bg-secondary d-flex align-items-center">
                  {filter.label}: {option?.label}
                  <button
                    className="btn-close btn-close-white ms-2"
                    style={{ fontSize: '0.7em' }}
                    onClick={() => filter.onChange('')}
                  ></button>
                </span>
              );
            })}
            {sortValue && (
              <span className="badge bg-info d-flex align-items-center">
                Sort: {sortOptions.find(opt => opt.value === sortValue)?.label}
                <button
                  className="btn-close btn-close-white ms-2"
                  style={{ fontSize: '0.7em' }}
                  onClick={() => onSortChange?.('')}
                ></button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;
