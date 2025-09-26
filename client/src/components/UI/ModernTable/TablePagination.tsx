import React from 'react';

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
  className?: string;
  showInfo?: boolean;
  maxVisiblePages?: number;
}

export const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  className = '',
  showInfo = true,
  maxVisiblePages = 5
}) => {
  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);
    
    // Adjust if we're near the beginning or end
    if (endPage - startPage + 1 < maxVisiblePages) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      } else {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
    }
    
    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('...');
      }
    }
    
    // Add visible pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Add ellipsis and last page if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
    
    return pages;
  };

  const getPageInfo = () => {
    if (!totalItems || !pageSize) return null;
    
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);
    
    return `Showing ${startItem} to ${endItem} of ${totalItems} entries`;
  };

  const visiblePages = getVisiblePages();

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={`table-pagination mt-4 ${className}`}>
      <div className="row align-items-center">
        <div className="col-md-6">
          {showInfo && getPageInfo() && (
            <div className="pagination-info text-muted small">
              <i className="bi bi-info-circle me-1"></i>
              {getPageInfo()}
            </div>
          )}
        </div>
        
        <div className="col-md-6">
          <nav aria-label="Table pagination">
            <ul className="pagination justify-content-end mb-0">
              {/* Previous Button */}
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  <i className="bi bi-chevron-left"></i>
                  <span className="d-none d-sm-inline ms-1">Previous</span>
                </button>
              </li>
              
              {/* Page Numbers */}
              {visiblePages.map((page, index) => (
                <li key={index} className={`page-item ${page === currentPage ? 'active' : ''} ${page === '...' ? 'disabled' : ''}`}>
                  {page === '...' ? (
                    <span className="page-link">
                      <i className="bi bi-three-dots"></i>
                    </span>
                  ) : (
                    <button
                      className="page-link"
                      onClick={() => onPageChange(page as number)}
                      aria-label={`Go to page ${page}`}
                      aria-current={page === currentPage ? 'page' : undefined}
                    >
                      {page}
                    </button>
                  )}
                </li>
              ))}
              
              {/* Next Button */}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  <span className="d-none d-sm-inline me-1">Next</span>
                  <i className="bi bi-chevron-right"></i>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default TablePagination;
