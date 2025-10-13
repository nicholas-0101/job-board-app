import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { statusOptions } from "../types";

interface PaymentFiltersProps {
  searchTerm: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
}

export default function PaymentFilters({
  searchTerm,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
}: PaymentFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3 sm:h-4 sm:w-4" />
        <Input
          placeholder="Search by email, name, or plan..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8 sm:pl-10 text-sm sm:text-base"
        />
      </div>
      
      <div className="flex items-center space-x-2 w-full sm:w-48">
        <Filter className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="text-sm sm:text-base">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
