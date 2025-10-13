"use client";

import { useRef } from "react";
import {
  ArrowUpDown,
  ArrowDownUp,
  Grid3x3,
  List,
} from "lucide-react";

interface PostedWithinDropdownProps {
  filters: {
    postedWithin?: "1" | "3" | "7" | "30";
  };
  showPostedDropdown: boolean;
  onToggleDropdown: () => void;
  onSelectPostedWithin: (value: "1" | "3" | "7" | "30" | undefined) => void;
  wrapperRef: React.RefObject<HTMLDivElement | null>;
}

function PostedWithinDropdown({
  filters,
  showPostedDropdown,
  onToggleDropdown,
  onSelectPostedWithin,
  wrapperRef,
}: PostedWithinDropdownProps) {
  return (
    <div className="relative order-2 sm:order-1" ref={wrapperRef}>
      <button
        type="button"
        onClick={onToggleDropdown}
        className="w-full sm:w-46 px-3 sm:px-4 py-2 rounded-lg bg-[#467EC7] text-white font-semibold text-xs sm:text-sm text-left flex justify-between items-center"
      >
        <span className="truncate">
          {filters.postedWithin === "1"
            ? "Posted Today"
            : filters.postedWithin === "3"
            ? "Posted Last 3 days"
            : filters.postedWithin === "7"
            ? "Posted Last 7 days"
            : filters.postedWithin === "30"
            ? "Posted Last 30 days"
            : "All Post"}
        </span>
        <span className="ml-2">▾</span>
      </button>

      {showPostedDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-sm z-10">
          {["", "1", "3", "7", "30"].map((value) => {
            const label =
              value === ""
                ? "All Post"
                : value === "1"
                ? "Posted Today"
                : value === "3"
                ? "Posted Last 3 days"
                : value === "7"
                ? "Posted Last 7 days"
                : "Posted Last 30 days";
            return (
              <button
                key={value}
                type="button"
                onClick={() => {
                  onSelectPostedWithin(value as "1" | "3" | "7" | "30" | undefined);
                }}
                className="w-full text-left px-3 sm:px-4 py-2 hover:bg-[#467EC7]/10 transition-colors rounded-lg text-xs sm:text-sm"
              >
                {label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface JobsControlsProps {
  jobsCount: number;
  totalCount: number;
  filters: {
    order?: "asc" | "desc";
    postedWithin?: "1" | "3" | "7" | "30";
  };
  viewMode: "grid" | "list";
  showPostedDropdown: boolean;
  onSortChange: () => void;
  onViewModeChange: (mode: "grid" | "list") => void;
  onToggleDropdown: () => void;
  onSelectPostedWithin: (value: "1" | "3" | "7" | "30" | undefined) => void;
  wrapperRef: React.RefObject<HTMLDivElement | null>;
}

export default function JobsControls({
  jobsCount,
  totalCount,
  filters,
  viewMode,
  showPostedDropdown,
  onSortChange,
  onViewModeChange,
  onToggleDropdown,
  onSelectPostedWithin,
  wrapperRef,
}: JobsControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
      <p className="text-xs sm:text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-semibold text-foreground">{jobsCount}</span> of{" "}
        {totalCount} jobs
      </p>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-card text-card-foreground rounded-xl p-1 shadow-sm border border-border">
          {/* Mobile: Sort button first, then posted filter */}
          <button
            onClick={onSortChange}
            className="flex items-center justify-center sm:justify-start gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg bg-[#467EC7] text-white hover:bg-[#467EC7]/80 transition-colors shadow-sm order-1 sm:order-2"
            title={`Sort ${
              filters.order === "asc" ? "Descending" : "Ascending"
            }`}
          >
            {filters.order === "asc" ? (
              <>
                <ArrowUpDown className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm font-medium">Oldest Jobs</span>
              </>
            ) : (
              <>
                <ArrowDownUp className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm font-medium">Newest Jobs</span>
              </>
            )}
          </button>

          <PostedWithinDropdown
            filters={filters}
            showPostedDropdown={showPostedDropdown}
            onToggleDropdown={onToggleDropdown}
            onSelectPostedWithin={onSelectPostedWithin}
            wrapperRef={wrapperRef}
          />

          <div className="hidden sm:block w-px bg-border h-6 mx-2 order-3" />

          <div className="hidden sm:flex items-center gap-1 order-4">
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
