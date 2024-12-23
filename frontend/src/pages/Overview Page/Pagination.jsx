import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
  startIndex,
  endIndex,
  totalResults,
}) => {
  const maxVisiblePages = 5;

  const getPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 px-6 py-4 m-10">
      <div className="text-sm text-gray-700">
        Showing <span className="font-medium">{startIndex}</span> to{" "}
        <span className="font-medium">{endIndex}</span> of{" "}
        <span className="font-medium">{totalResults}</span> results
      </div>

      <div className="flex items-center gap-6">
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center px-4 py-2 border rounded-lg text-sm font-medium transition-colors duration-200 ${
            currentPage === 1
              ? "text-gray-300 border-gray-200 cursor-not-allowed"
              : "text-gray-500 hover:bg-gray-50 border-gray-300"
          }`}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </button>

        <div className="flex items-center gap-2">
          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => handlePageClick(page)}
              className={`min-w-[40px] h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors duration-200 ${
                currentPage === page
                  ? "bg-green-500 text-white border border-green-500"
                  : "text-gray-500 hover:bg-gray-50 border border-gray-300"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center px-4 py-2 border rounded-lg text-sm font-medium transition-colors duration-200 ${
            currentPage === totalPages
              ? "text-gray-300 border-gray-200 cursor-not-allowed"
              : "text-gray-500 hover:bg-gray-50 border-gray-300"
          }`}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
