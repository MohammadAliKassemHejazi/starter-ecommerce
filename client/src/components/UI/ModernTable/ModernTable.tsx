import React, { useState, useMemo, ReactNode } from 'react';
import { TableHeader } from './TableHeader';
import { TableActions } from './TableActions';
import { TablePagination } from './TablePagination';
import { TableLoading } from './TableLoading';
import { TableEmpty } from './TableEmpty';

export interface TableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T, index: number) => ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  headerClassName?: string;
}

export interface TableAction<T = any> {
  key: string;
  label: string;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  onClick: (row: T) => void;
  show?: (row: T) => boolean;
  className?: string;
}

export interface ModernTableProps<T = any> {
  // Data
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  
  // Loading & Empty States
  loading?: boolean;
  emptyMessage?: string;
  emptyIcon?: string;
  
  // Search & Filter
  searchable?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  
  // Pagination
  pagination?: boolean;
  pageSize?: number;
  currentPage?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  
  // Sorting
  sortable?: boolean;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (field: string, direction: 'asc' | 'desc') => void;
  
  // Row Interactions
  onRowClick?: (row: T, index: number) => void;
  selectable?: boolean;
  selectedRows?: T[];
  onSelectionChange?: (selectedRows: T[]) => void;
  
  // Styling
  className?: string;
  tableClassName?: string;
  striped?: boolean;
  hover?: boolean;
  bordered?: boolean;
  size?: 'sm' | 'md' | 'lg';
  
  // Header Actions
  headerActions?: ReactNode;
  
  // Footer
  footer?: ReactNode;
}

export const ModernTable = <T extends Record<string, any>>({
  data,
  columns,
  actions = [],
  loading = false,
  emptyMessage = 'No data found',
  emptyIcon = 'bi-inbox',
  searchable = true,
  searchPlaceholder = 'Search...',
  searchValue = '',
  onSearchChange,
  pagination = true,
  pageSize = 10,
  currentPage = 1,
  totalItems,
  onPageChange,
  sortable = true,
  sortField,
  sortDirection = 'asc',
  onSort,
  onRowClick,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  className = '',
  tableClassName = '',
  striped = true,
  hover = true,
  bordered = true,
  size = 'md',
  headerActions,
  footer
}: ModernTableProps<T>) => {
  const [internalSearch, setInternalSearch] = useState('');
  const [internalSortField, setInternalSortField] = useState<string | null>(null);
  const [internalSortDirection, setInternalSortDirection] = useState<'asc' | 'desc'>('asc');
  const [internalPage, setInternalPage] = useState(1);
  const [internalSelectedRows, setInternalSelectedRows] = useState<T[]>([]);

  // Use internal state if not controlled
  const searchTerm = onSearchChange ? searchValue : internalSearch;
  const sortFieldValue = onSort ? sortField : internalSortField;
  const sortDirectionValue = onSort ? sortDirection : internalSortDirection;
  const page = onPageChange ? currentPage : internalPage;
  const selectedRowsValue = onSelectionChange ? selectedRows : internalSelectedRows;

  const filteredData = useMemo(() => {

    let filtered = data;

    // Search filter
    if (searchTerm) {
      
      filtered = filtered.filter(row =>
        columns.some(column => {
          const value = row[column.key];
          return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // Sort
    if (sortFieldValue) {
      filtered.sort((a, b) => {
        const aValue = a[sortFieldValue];
        const bValue = b[sortFieldValue];
        
        if (aValue < bValue) {
          return sortDirectionValue === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortDirectionValue === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
debugger;
    return filtered;
  }, [data, searchTerm, sortFieldValue, sortDirectionValue, columns]);

  const paginatedData = useMemo(() => {
    if (!pagination) {
      return filteredData;
    }
    
    const startIndex = (page - 1) * pageSize;
   
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, page, pageSize, pagination]);

  const totalPages = Math.ceil((totalItems || filteredData.length) / pageSize);

  const handleSearch = (value: string) => {
    if (onSearchChange) {
      onSearchChange(value);
    } else {
      setInternalSearch(value);
    }
  };

  const handleSort = (field: string) => {
    if (!sortable) {return;}

    const newDirection = sortFieldValue === field && sortDirectionValue === 'asc' ? 'desc' : 'asc';
    
    if (onSort) {
      onSort(field, newDirection);
    } else {
      setInternalSortField(field);
      setInternalSortDirection(newDirection);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (onPageChange) {
      onPageChange(newPage);
    } else {
      setInternalPage(newPage);
    }
  };

  const handleRowClick = (row: T, index: number) => {
    if (onRowClick) {
      onRowClick(row, index);
    }
  };

  const handleSelectRow = (row: T, checked: boolean) => {
    if (!selectable || !onSelectionChange) {return;}

    const newSelectedRows = checked
      ? [...selectedRowsValue, row]
      : selectedRowsValue.filter(r => r !== row);

    if (onSelectionChange) {
      onSelectionChange(newSelectedRows);
    } else {
      setInternalSelectedRows(newSelectedRows);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (!selectable || !onSelectionChange) {return;}

    const newSelectedRows = checked ? [...paginatedData] : [];
    
    if (onSelectionChange) {
      onSelectionChange(newSelectedRows);
    } else {
      setInternalSelectedRows(newSelectedRows);
    }
  };

  const isAllSelected = selectable && paginatedData.length > 0 && 
    paginatedData.every(row => selectedRowsValue.includes(row));

  const isIndeterminate = selectable && selectedRowsValue.length > 0 && 
    selectedRowsValue.length < paginatedData.length;

  if (loading) {
    return <TableLoading />;
  }

  return (
    <div className={`modern-table ${className}`}>
      {/* Header */}
      <TableHeader
        searchable={searchable}
        searchPlaceholder={searchPlaceholder}
        searchValue={searchTerm}
        onSearchChange={handleSearch}
        actions={headerActions}
        totalItems={totalItems || filteredData.length}
      />

      {/* Table */}
      <div className="table-responsive">
        <table className={`table ${tableClassName} ${striped ? 'table-striped' : ''} ${hover ? 'table-hover' : ''} ${bordered ? 'table-bordered' : ''} table-${size}`}>
          <thead className="table-dark">
            <tr>
              {selectable && (
                <th style={{ width: '50px' }}>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={isAllSelected}
                    ref={(input) => {
                      if (input) {input.indeterminate = isIndeterminate;}
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`${column.headerClassName || ''} ${column.align ? `text-${column.align}` : ''}`}
                  style={{ 
                    width: column.width, 
                    cursor: column.sortable !== false && sortable ? 'pointer' : 'default' 
                  }}
                  onClick={() => column.sortable !== false && sortable && handleSort(column.key)}
                >
                  <div className="d-flex align-items-center">
                    <span className="flex-grow-1">{column.label}</span>
                    {column.sortable !== false && sortable && (
                      <span className="ms-2">
                        {sortFieldValue === column.key ? (
                          sortDirectionValue === 'asc' ? (
                            <i className="bi bi-arrow-up"></i>
                          ) : (
                            <i className="bi bi-arrow-down"></i>
                          )
                        ) : (
                          <i className="bi bi-arrow-up-down"></i>
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {actions.length > 0 && (
                <th className="text-center" style={{ width: '120px' }}>
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <TableEmpty 
                colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)}
                message={emptyMessage}
                icon={emptyIcon}
              />
            ) : (
              paginatedData.map((row, index) => (
                <tr
                  key={index}
                  onClick={() => handleRowClick(row, index)}
                  style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                  className={`${selectedRowsValue.includes(row) ? 'table-active' : ''}`}
                >
                  {selectable && (
                    <td onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={selectedRowsValue.includes(row)}
                        onChange={(e) => handleSelectRow(row, e.target.checked)}
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    
                    console.log(row, 'Rendering row data:'),
                    console.log(column, 'Rendering column key:'),
                    <td 
                      key={column.key}
                      className={`${column.className || ''} ${column.align ? `text-${column.align}` : ''}`}
                    >
                      {column.render ? column.render(row[column.key], row, index) : row[column.key]}
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="text-center" onClick={(e) => e.stopPropagation()}>
                      <TableActions actions={actions} row={row} />
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <TablePagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={totalItems || filteredData.length}
          pageSize={pageSize}
        />
      )}

      {/* Footer */}
      {footer && (
        <div className="table-footer mt-3">
          {footer}
        </div>
      )}
    </div>
  );
};

export default ModernTable;
