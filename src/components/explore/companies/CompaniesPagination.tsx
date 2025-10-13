"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface CompaniesPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function CompaniesPagination({
  currentPage,
  totalPages,
  onPageChange,
}: CompaniesPaginationProps) {
  const getVisiblePages = (current: number, total: number, maxVisible = 5) => {
    const pages: (number | string)[] = [];

    if (total <= maxVisible + 2) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      let start = Math.max(current - 1, 2);
      let end = Math.min(current + 1, total - 1);
      if (start > 2) pages.push("…");
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < total - 1) pages.push("…");
      pages.push(total);
    }

    return pages;
  };

  return (
    <div className="mt-4 sm:mt-6 flex items-center justify-center gap-1 sm:gap-2">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="p-1.5 sm:p-2 rounded-xl bg-card text-foreground hover:text-foreground/60 disabled:opacity-30 transition-all"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {getVisiblePages(currentPage, totalPages).map((p, i) =>
        typeof p === "string" ? (
          <span key={i} className="px-2 sm:px-3 py-1 sm:py-2 text-sm">
            {p}
          </span>
        ) : (
          <button
            key={i}
            onClick={() => onPageChange(p)}
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl font-medium text-sm sm:text-base ${
              currentPage === p
                ? "bg-[#467EC7] text-primary-foreground"
                : "border border-border bg-[#A3B6CE] text-primary-foreground hover:bg-[#467EC7] transition-colors"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="p-1.5 sm:p-2 rounded-xl bg-card text-foreground hover:text-foreground/60 disabled:opacity-30 transition-all"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </div>
  );
}
