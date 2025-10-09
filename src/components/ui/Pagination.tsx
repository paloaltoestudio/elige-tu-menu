interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleFirst = () => {
    onPageChange(1);
  };

  const handleLast = () => {
    onPageChange(totalPages);
  };

  // On mobile, show only a limited number of page buttons
  const getVisiblePages = () => {
    const maxVisible = 3; // Show max 3 pages on mobile
    const pages: (number | string)[] = [];
    
    if (totalPages <= maxVisible + 2) {
      // Show all pages if total is small
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // Show first page
    pages.push(1);
    
    if (currentPage > 2) {
      pages.push('...');
    }
    
    // Show current page and neighbors
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    
    if (currentPage < totalPages - 1) {
      pages.push('...');
    }
    
    // Show last page
    pages.push(totalPages);
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
      {/* Page info - mobile */}
      <div className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
        Página {currentPage} de {totalPages}
      </div>
      
      {/* Pagination buttons */}
      <div className="flex items-center space-x-1 order-1 sm:order-2">
        <button
          onClick={handleFirst}
          disabled={currentPage === 1}
          className="hidden sm:block px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          &lt;&lt;
        </button>
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          &lt;
        </button>
        
        {visiblePages.map((page, idx) => (
          page === '...' ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-gray-500">...</span>
          ) : (
            <button
              key={page}
              onClick={() => typeof page === 'number' && onPageChange(page)}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm border rounded ${
                currentPage === page
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          )
        ))}
        
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          &gt;
        </button>
        <button
          onClick={handleLast}
          disabled={currentPage === totalPages}
          className="hidden sm:block px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          &gt;&gt;
        </button>
      </div>
    </div>
  );
};
