import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface JobFiltersProps {
  title: string;
  category: string;
  sortBy: "createdAt" | "deadline";
  sortOrder: "asc" | "desc";
  limit: number;
  onTitleChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSortByChange: (value: "createdAt" | "deadline") => void;
  onSortOrderChange: (value: "asc" | "desc") => void;
  onLimitChange: (value: number) => void;
}

export default function JobFilters({
  title,
  category,
  sortBy,
  sortOrder,
  limit,
  onTitleChange,
  onCategoryChange,
  onSortByChange,
  onSortOrderChange,
  onLimitChange,
}: JobFiltersProps) {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#467EC7]"
          >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-5">
          <Input
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Search by title..."
            className="rounded-xl"
          />
          <Input
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            placeholder="Category..."
            className="rounded-xl"
          />
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as any)}
            className="px-3 py-2 border rounded-xl bg-background hover:border-primary transition-colors"
          >
            <option value="createdAt">Sort: Created</option>
            <option value="deadline">Sort: Deadline</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => onSortOrderChange(e.target.value as any)}
            className="px-3 py-2 border rounded-xl bg-background hover:border-primary transition-colors"
          >
            <option value="desc">Order: Desc</option>
            <option value="asc">Order: Asc</option>
          </select>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="px-3 py-2 border rounded-xl bg-background hover:border-primary transition-colors"
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n} per page
              </option>
            ))}
          </select>
        </div>
      </CardContent>
    </Card>
  );
}
