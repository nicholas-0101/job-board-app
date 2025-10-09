import { Button } from "@/components/ui/button";
import { Filter, Search } from "lucide-react";
import type { AssessmentFilters } from "@/types/skillAssessment";

interface AssessmentFiltersProps {
  filters: AssessmentFilters;
  onFiltersChange: (filters: AssessmentFilters) => void;
  onSearch: (query: string) => void;
  categories: { value: string; label: string; }[];
}

// Helper functions (max 15 lines each)

const FilterSelect = ({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
}) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
  >
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

const SearchInput = ({ onSearch }: { onSearch: (query: string) => void }) => (
  <div className="relative flex-1 max-w-md">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
    <input
      type="text"
      placeholder="Search assessments..."
      onChange={(e) => onSearch(e.target.value)}
      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <SearchInput onSearch={onSearch} />

        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>

          <FilterSelect
            value={filters.category}
            onChange={(value) => updateFilter("category", value)}
            options={categories}
            placeholder="Category"
          />
        </div>
      </div>
    </div>
  );
}
