"use client";

import { ArrowUpDown, ArrowDownUp } from "lucide-react";

interface MyApplicationsHeaderProps {
  sortOrder: "asc" | "desc";
  onSortToggle: () => void;
}

export default function MyApplicationsHeader({
  sortOrder,
  onSortToggle,
}: MyApplicationsHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4 sm:mb-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#467EC7]">
        My Applications
      </h1>
      <button
        onClick={onSortToggle}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        title={`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
      >
        {sortOrder === "asc" ? (
          <ArrowUpDown className="w-4 h-4 sm:w-5 sm:h-5 text-[#467EC7]" />
        ) : (
          <ArrowDownUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#467EC7]" />
        )}
      </button>
    </div>
  );
}
