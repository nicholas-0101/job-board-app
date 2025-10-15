"use client";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ChevronLeft, ChevronRight } from "lucide-react";
import { ApplicantDTO } from "@/lib/applicants";
import ApplicantCard from "./ApplicantCard";
import SortControls from "./SortControls";

interface ApplicantsContentProps {
  applicants: ApplicantDTO[];
  loading: boolean;
  total: number;
  page: number;
  limit: number;
  sortBy: "appliedAt" | "expectedSalary" | "age";
  sortOrder: "asc" | "desc";
  onSortChange: (sortBy: "appliedAt" | "expectedSalary" | "age") => void;
  onSortOrderChange: (sortOrder: "asc" | "desc") => void;
  onPageChange: (page: number) => void;
  onStatusUpdate: (applicantId: number, status: string) => void;
}

export function ApplicantsContent({
  applicants,
  loading,
  total,
  page,
  limit,
  sortBy,
  sortOrder,
  onSortChange,
  onSortOrderChange,
  onPageChange,
  onStatusUpdate,
}: ApplicantsContentProps) {
  const totalPages = Math.ceil(total / limit);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#24CFA7] mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading applicants...</p>
        </div>
      </div>
    );
  }

  if (applicants.length === 0) {
    return (
      <Card className="shadow-md">
        <CardContent className="py-20">
          <div className="text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Applicants Found
            </h3>
            <p className="text-gray-500">
              No applicants match your current filters.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-lg font-semibold">
            Applicants ({total})
          </CardTitle>
          <SortControls
            sortBy={sortBy}
            sortOrder={sortOrder}
            setSortBy={onSortChange}
            setSortOrder={onSortOrderChange}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {applicants.map((applicant, index) => (
            <motion.div
              key={applicant.applicationId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ApplicantCard
                applicant={applicant}
                onUpdateStatus={onStatusUpdate}
              />
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} applicants
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                className="gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
                className="gap-1"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
