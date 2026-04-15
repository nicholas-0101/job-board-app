"use client";

import { useRef, useState, useEffect } from "react";
import { Filter, Search } from "lucide-react";
import type { AssessmentFilters } from "@/types/skillAssessment";

interface AssessmentFiltersProps {
  filters: AssessmentFilters;
  onFiltersChange: (filters: AssessmentFilters) => void;
  onSearch: (query: string) => void;
  categories: { value: string; label: string; }[];
}

// Helper functions (max 15 lines each)

const CategoryDropdown = ({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = options.find((o) => o.value === value)?.label || "All Categories";

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full sm:w-48 px-3 sm:px-4 py-2 rounded-lg bg-white text-grey-800 border border-gray-200 font-semibold text-xs sm:text-sm text-left flex justify-between items-center"
      >
        <span className="truncate">{selectedLabel}</span>
        <span className="ml-2">▾</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-sm z-10">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className="w-full text-left px-3 sm:px-4 py-2 hover:bg-[#467EC7]/10 transition-colors rounded-lg text-xs sm:text-sm"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const SearchInput = ({ onSearch }: { onSearch: (query: string) => void }) => (
  <div className="relative flex-1 w-full max-w-full sm:max-w-md">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
    <input
      type="text"
      placeholder="Search assessments..."
      onChange={(e) => onSearch(e.target.value)}
      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-4 focus:ring-grey-500 focus:border-transparent"
    />
  </div>
);

export default function AssessmentFilters({
  filters,
  onFiltersChange,
  onSearch,
  categories,
}: AssessmentFiltersProps) {
  const updateFilter = (key: keyof AssessmentFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between w-full">
        <SearchInput onSearch={onSearch} />

        <div className="flex flex-wrap gap-3 items-center w-full lg:w-auto">

          <CategoryDropdown
            value={filters.category}
            onChange={(value) => updateFilter("category", value)}
            options={categories}
          />
        </div>
      </div>
    </div>
  );
}

