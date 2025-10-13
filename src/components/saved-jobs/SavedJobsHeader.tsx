"use client";

import { ArrowUpDown, ArrowDownUp } from "lucide-react";

interface SavedJobsHeaderProps {
  sortOrder: "asc" | "desc";
  onToggleSort: () => void;
}

export default function SavedJobsHeader({ sortOrder, onToggleSort }: SavedJobsHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold text-[#467EC7]">Saved Jobs</h1>
      <button
        onClick={onToggleSort}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        title={`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
      >
        {sortOrder === "asc" ? (
          <ArrowUpDown className="w-5 h-5 text-[#467EC7]" />
        ) : (
          <ArrowDownUp className="w-5 h-5 text-[#467EC7]" />
        )}
      </button>
    </div>
  );
}
