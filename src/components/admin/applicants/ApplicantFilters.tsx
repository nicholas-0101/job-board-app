import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, Search } from "lucide-react";

interface ApplicantFiltersProps {
  filters: {
    name: string;
    education: string;
    ageMin: string;
    ageMax: string;
    expectedSalaryMin: string;
    expectedSalaryMax: string;
    sortBy: "appliedAt" | "expectedSalary" | "age";
    sortOrder: "asc" | "desc";
  };
  limit: number;
  onFiltersChange: (filters: any) => void;
  onLimitChange: (limit: number) => void;
  onApplyFilters: () => void;
}

export default function ApplicantFilters({
  filters,
  limit,
  onFiltersChange,
  onLimitChange,
  onApplyFilters,
}: ApplicantFiltersProps) {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Filter className="w-5 h-5 text-[#467EC7]" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-6 mb-3">
          <Input
            value={filters.name}
            onChange={(e) => onFiltersChange({ ...filters, name: e.target.value })}
            placeholder="Name"
            className="rounded-xl"
          />
          <Input
            value={filters.education}
            onChange={(e) => onFiltersChange({ ...filters, education: e.target.value })}
            placeholder="Education"
            className="rounded-xl"
          />
          <Input
            type="number"
            value={filters.ageMin}
            onChange={(e) => onFiltersChange({ ...filters, ageMin: e.target.value })}
            placeholder="Min Age"
            className="rounded-xl"
          />
          <Input
            type="number"
            value={filters.ageMax}
            onChange={(e) => onFiltersChange({ ...filters, ageMax: e.target.value })}
            placeholder="Max Age"
            className="rounded-xl"
          />
          <Input
            type="number"
            value={filters.expectedSalaryMin}
            onChange={(e) => onFiltersChange({ ...filters, expectedSalaryMin: e.target.value })}
            placeholder="Min Salary"
            className="rounded-xl"
          />
          <Input
            type="number"
            value={filters.expectedSalaryMax}
            onChange={(e) => onFiltersChange({ ...filters, expectedSalaryMax: e.target.value })}
            placeholder="Max Salary"
            className="rounded-xl"
          />
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          <select
            value={filters.sortBy}
            onChange={(e) => onFiltersChange({ ...filters, sortBy: e.target.value as any })}
            className="px-3 py-2 border rounded-xl bg-background"
          >
            <option value="appliedAt">Sort: Applied Date</option>
            <option value="expectedSalary">Sort: Expected Salary</option>
            <option value="age">Sort: Age</option>
          </select>
          <select
            value={filters.sortOrder}
            onChange={(e) => onFiltersChange({ ...filters, sortOrder: e.target.value as any })}
            className="px-3 py-2 border rounded-xl bg-background"
          >
            <option value="desc">Order: Desc</option>
            <option value="asc">Order: Asc</option>
          </select>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="px-3 py-2 border rounded-xl bg-background"
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n} per page
              </option>
            ))}
          </select>
          <Button
            onClick={onApplyFilters}
            className="bg-[#24CFA7] hover:bg-[#1fc39c]"
          >
            <Search className="w-4 h-4 mr-2" />
            Apply
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
