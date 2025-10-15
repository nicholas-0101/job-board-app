"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SortControlsProps {
  sortBy: "appliedAt" | "expectedSalary" | "age";
  setSortBy: (value: "appliedAt" | "expectedSalary" | "age") => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (value: "asc" | "desc") => void;
}

export default function SortControls({
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
}: SortControlsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sort By</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            variant={sortBy === "appliedAt" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("appliedAt")}
          >
            Application Date
          </Button>
          <Button
            variant={sortBy === "expectedSalary" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("expectedSalary")}
          >
            Expected Salary
          </Button>
          <Button
            variant={sortBy === "age" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("age")}
          >
            Age
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant={sortOrder === "asc" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortOrder("asc")}
          >
            Ascending
          </Button>
          <Button
            variant={sortOrder === "desc" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortOrder("desc")}
          >
            Descending
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
