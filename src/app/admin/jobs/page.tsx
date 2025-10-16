"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useJobsData } from "@/hooks/useJobsData";
import JobFilters from "@/components/admin/jobs/JobFilters";
import JobCard from "@/components/admin/jobs/JobCard";
import JobTableRow from "@/components/admin/jobs/JobTableRow";
import EmptyJobsState from "@/components/admin/jobs/EmptyJobsState";
import LoadingSpinner from "@/components/admin/shared/LoadingSpinner";
import ErrorCard from "@/components/admin/shared/ErrorCard";
import Pagination from "@/components/admin/shared/Pagination";

export default function AdminJobsPage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState<"createdAt" | "deadline">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const { data, loading, error, handleTogglePublish } = useJobsData({
    title,
    category,
    sortBy,
    sortOrder,
    limit,
    page,
  });

  const totalPages = Math.max(1, Math.ceil(data.total / limit));

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b bg-gradient-to-r from-primary-50 to-secondary-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold">Company Jobs</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your job postings
              </p>
            </div>
            <Link href="/admin/jobs/new">
              <Button className="bg-[#24CFA7] hover:bg-[#1fc39c] gap-2 shadow-md hover:shadow-lg transition-all">
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
                >
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
                New Job
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        <JobFilters
          title={title}
          category={category}
          sortBy={sortBy}
          sortOrder={sortOrder}
          limit={limit}
          onTitleChange={setTitle}
          onCategoryChange={setCategory}
          onSortByChange={setSortBy}
          onSortOrderChange={setSortOrder}
          onLimitChange={setLimit}
        />

        {loading ? (
          <LoadingSpinner message="Loading jobs..." />
        ) : error ? (
          <ErrorCard message={error} />
        ) : (
          <>
            {data.items.length === 0 && <EmptyJobsState />}
            
            {/* Card list on small screens */}
            <div className="grid gap-4 md:hidden">
              {data.items.map((j) => (
                <JobCard
                  key={j.id}
                  job={j}
                  onTogglePublish={handleTogglePublish}
                />
              ))}
            </div>

            {/* Table on md and above */}
            <Card className="hidden md:block shadow-md overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-primary-50 to-secondary-50">
                      <tr>
                        <th className="text-left p-4 font-semibold text-foreground">
                          Title
                        </th>
                        <th className="text-left p-4 font-semibold text-foreground">
                          Category
                        </th>
                        <th className="text-left p-4 font-semibold text-foreground">
                          City
                        </th>
                        <th className="text-left p-4 font-semibold text-foreground">
                          Applicants
                        </th>
                        <th className="text-left p-4 font-semibold text-foreground">
                          Status
                        </th>
                        <th className="text-left p-4 font-semibold text-foreground">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {data.items.map((j) => (
                        <JobTableRow
                          key={j.id}
                          job={j}
                          onTogglePublish={handleTogglePublish}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {data.items.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            className="mt-6"
          />
        )}
      </div>
    </div>
  );
}
