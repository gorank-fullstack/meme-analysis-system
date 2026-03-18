import React from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";
import { ChevronLeft} from "@/components/icons/paging/ChevronLeft";
import { ChevronRight} from "@/components/icons/paging/ChevronRight";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function TrendingPagination({ 
    currentPage, 
    totalPages, 
    onPageChange , 
}: PaginationProps) {
  const getPageList = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, "...", totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(
        1,
        "...",
        currentPage - 2,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        currentPage + 2,
        "...",
        totalPages
      );
    }

    return pages;
  };

  return (
    <div className="join flex items-center justify-center text-white">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="join-item btn btn-sm btn-circle bg-base-200 hover:bg-base-300 disabled:opacity-40"
      >
        {/* <ChevronLeft size={16} /> */}
        <ChevronLeft width={16} height={16}/>
      </button>

      {getPageList().map((page, i) =>
        typeof page === "number" ? (
          <button
            key={i}
            onClick={() => onPageChange(page)}
            className={`join-item btn btn-sm btn-circle ${
              page === currentPage ? "bg-white text-black font-bold" : "bg-base-200 hover:bg-base-300"
            }`}
          >
            {page}
          </button>
        ) : (
          <span key={i} className="join-item btn btn-sm btn-circle bg-base-100 border-none text-gray-400 cursor-default">
            {page}
          </span>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="join-item btn btn-sm btn-circle bg-base-200 hover:bg-base-300 disabled:opacity-40"
      >
        {/* <ChevronRight size={16} /> */}
        <ChevronRight width={16} height={16}/>
      </button>
    </div>
  );
}
