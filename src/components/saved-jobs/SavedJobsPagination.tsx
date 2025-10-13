"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface SavedJobsPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  getVisiblePages: (current: number, total: number, maxVisible?: number) => (number | string)[];
}

export default function SavedJobsPagination({
  page,
  totalPages,
  onPageChange,
  getVisiblePages,
}: SavedJobsPaginationProps) {
  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="p-2 rounded-xl bg-card text-foreground hover:text-foreground/60 disabled:opacity-30 transition-all"
      >
        <ChevronLeft />
      </button>

      {getVisiblePages(page, totalPages).map((p, i) =>
        typeof p === "string" ? (
          <span key={i} className="px-3 py-2">
            {p}
          </span>
        ) : (
          <button
            key={i}
            onClick={() => onPageChange(p)}
            className={`w-10 h-10 rounded-xl font-medium ${
              page === p
                ? "bg-[#467EC7] text-primary-foreground"
                : "border border-border bg-[#A3B6CE] text-primary-foreground hover:bg-[#467EC7] transition-colors"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="p-2 rounded-xl bg-card text-foreground hover:text-foreground/60 disabled:opacity-30 transition-all"
      >
        <ChevronRight />
      </button>
    </div>
  );
}
