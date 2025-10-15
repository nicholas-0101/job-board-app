"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";
import Link from "next/link";
import { JobItemDTO } from "@/lib/jobs";

interface JobsContentProps {
  jobs: JobItemDTO[];
  loading: boolean;
  total: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onTogglePublish: (jobId: number, isPublished: boolean) => void;
}

export function JobsContent({
  jobs,
  loading,
  total,
  page,
  limit,
  onPageChange,
  onTogglePublish,
}: JobsContentProps) {
  const totalPages = Math.ceil(total / limit);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#24CFA7] mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading jobs...</p>
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <Card className="shadow-md">
        <CardContent className="py-20">
          <div className="text-center">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Jobs Found
            </h3>
            <p className="text-gray-500">
              No jobs match your current filters.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50">
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
              {jobs.map((job) => (
                <tr
                  key={job.id}
                  className="hover:bg-secondary/50 transition-colors"
                >
                  <td className="p-4">
                    <div className="font-medium text-foreground">
                      {job.title}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-blue-100 text-blue-700 font-medium">
                      {job.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="flex items-center text-sm text-muted-foreground">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-1"
                      >
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {job.city}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-purple-100 text-purple-700 font-medium">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-1"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                      {job.applicantsCount || 0}
                    </span>
                  </td>
                  <td className="p-4">
                    {job.isPublished ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-700 font-medium">
                        ✓ Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700 font-medium">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-[#467EC7] hover:bg-[#578BCC] shadow-sm"
                        onClick={() => onTogglePublish(job.id, job.isPublished || false)}
                      >
                        {job.isPublished ? "Unpublish" : "Publish"}
                      </Button>
                      <Link href={`/admin/jobs/${job.id}/edit`}>
                        <Button
                          size="sm"
                          className="bg-[#24CFA7] hover:bg-[#1fc39c] shadow-sm"
                        >
                          Edit
                        </Button>
                      </Link>
                      <Link href={`/admin/jobs/${job.id}/applicants`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="hover:bg-secondary"
                        >
                          Applicants
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6 p-4 border-t">
            <Button
              variant="outline"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="hover:bg-[#467EC7] hover:text-white transition-colors rounded-xl"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              Prev
            </Button>
            <div className="px-4 py-2 bg-secondary rounded-xl">
              <span className="font-medium">Page {page}</span>
              <span className="text-muted-foreground"> of {totalPages}</span>
            </div>
            <Button
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="hover:bg-[#467EC7] hover:text-white transition-colors rounded-xl"
            >
              Next
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-1"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
