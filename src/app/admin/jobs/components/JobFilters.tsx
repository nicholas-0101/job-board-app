"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter } from "lucide-react";

interface JobFiltersProps {
  title: string;
  setTitle: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  sortBy: "createdAt" | "deadline";
  setSortBy: (value: "createdAt" | "deadline") => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (value: "asc" | "desc") => void;
  onApplyFilters: () => void;
}

export default function JobFilters({
  title,
  setTitle,
  category,
  setCategory,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  onApplyFilters,
}: JobFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input
              placeholder="Search by title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Category</label>
            <Input
              placeholder="Search by category..."
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "createdAt" | "deadline")}
              className="w-full px-3 py-2 border rounded-md bg-background"
            >
              <option value="createdAt">Created Date</option>
              <option value="deadline">Deadline</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Order</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
              className="w-full px-3 py-2 border rounded-md bg-background"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
        <Button onClick={onApplyFilters} className="w-full">
          <Search className="h-4 w-4 mr-2" />
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  );
}
