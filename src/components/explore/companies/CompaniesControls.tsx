"use client";

import {
  ArrowUpDown,
  ArrowDownUp,
  ArrowUpAZ,
  ArrowDownAz,
  Grid3x3,
  List,
} from "lucide-react";

interface CompaniesControlsProps {
  companiesCount: number;
  totalCount: number;
  filters: {
    sort?: "name" | "jobsCount";
    order?: "asc" | "desc";
  };
  viewMode: "grid" | "list";
  onSortChange: (sort: "name" | "jobsCount") => void;
  onViewModeChange: (mode: "grid" | "list") => void;
}

export default function CompaniesControls({
  companiesCount,
  totalCount,
  filters,
  viewMode,
  onSortChange,
  onViewModeChange,
}: CompaniesControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
      <p className="text-xs sm:text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-semibold text-foreground">
          {companiesCount}
        </span>{" "}
        of {totalCount} companies
      </p>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-card text-card-foreground rounded-xl p-1 shadow-sm border border-border">
          {/* Sort by Name */}
          <button
            onClick={() => onSortChange("name")}
            className={`flex items-center justify-center sm:justify-start gap-1 px-3 py-2 text-xs sm:text-sm rounded-lg transition-all ${
              filters.sort === "name"
                ? "bg-[#467EC7] text-white font-semibold shadow-sm"
                : "text-muted-foreground hover:bg-secondary"
            }`}
          >
            {filters.sort === "name" &&
              (filters.order === "asc" ? (
                <ArrowDownAz className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <ArrowUpAZ className="w-4 h-4 sm:w-5 sm:h-5" />
              ))}
            Name
          </button>

          {/* Sort by Jobs Count */}
          <button
            onClick={() => onSortChange("jobsCount")}
            className={`flex items-center justify-center sm:justify-start gap-1 px-3 py-2 text-xs sm:text-sm rounded-lg transition-all ${
              filters.sort === "jobsCount"
                ? "bg-[#467EC7] text-white font-semibold shadow-sm"
                : "text-muted-foreground hover:bg-secondary"
            }`}
          >
            {filters.sort === "jobsCount" &&
              (filters.order === "asc" ? (
                <ArrowUpDown className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <ArrowDownUp className="w-4 h-4 sm:w-5 sm:h-5" />
              ))}
            Jobs Count
          </button>

          {/* Divider */}
          <div className="hidden sm:block w-px bg-border h-6 mx-2" />

          {/* View mode buttons */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => onViewModeChange("grid")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "grid"
                  ? "bg-[#467EC7] text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "list"
                  ? "bg-[#467EC7] text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
