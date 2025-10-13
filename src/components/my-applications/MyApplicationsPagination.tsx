"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { getVisiblePages } from "@/lib/utils/paginationUtils";

interface MyApplicationsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function MyApplicationsPagination({
  currentPage,
  totalPages,
  onPageChange,
}: MyApplicationsPaginationProps) {
  return (
    <div className="mt-6 sm:mt-8 flex items-center justify-center gap-1 sm:gap-2">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="p-1.5 sm:p-2 rounded-xl bg-card text-foreground hover:text-foreground/60 disabled:opacity-30 transition-all"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {getVisiblePages(currentPage, totalPages).map((p, i) =>
        typeof p === "string" ? (
          <span
            key={i}
            className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
          >
            {p}
          </span>
        ) : (
          <button
            key={i}
            onClick={() => onPageChange(p)}
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl font-medium text-xs sm:text-sm ${
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
