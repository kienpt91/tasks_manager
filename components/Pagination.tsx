"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  total: number;
  limit: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  total,
  limit,
}: PaginationProps) {
  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t gap-4">
      <div className="text-sm text-gray-600 order-2 sm:order-1">
        Showing {startItem} to {endItem} of {total} tasks
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 order-1 sm:order-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 sm:px-4 py-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm"
        >
          Previous
        </button>

        <div className="flex items-center gap-1 sm:gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            // Show first page, last page, current page, and pages around current
            const showPage =
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1);

            if (!showPage) {
              // Show ellipsis
              if (page === currentPage - 2 || page === currentPage + 2) {
                return (
                  <span key={page} className="px-1 sm:px-2 text-sm">
                    ...
                  </span>
                );
              }
              return null;
            }

            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-3 sm:px-4 py-2 rounded-lg border transition-colors text-sm ${
                  page === currentPage
                    ? "bg-blue-500 text-white border-blue-500"
                    : "hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 sm:px-4 py-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm"
        >
          Next
        </button>
      </div>
    </div>
  );
}
