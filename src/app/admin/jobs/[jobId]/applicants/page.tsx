"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useApplicantsData } from "@/hooks/useApplicantsData";
import ApplicantStats from "@/components/admin/applicants/ApplicantStats";
import ApplicantFilters from "@/components/admin/applicants/ApplicantFilters";
import ApplicantCard from "@/components/admin/applicants/ApplicantCard";
import ApplicantTableRow from "@/components/admin/applicants/ApplicantTableRow";
import EmptyApplicantsState from "@/components/admin/applicants/EmptyApplicantsState";
import LoadingSpinner from "@/components/admin/shared/LoadingSpinner";
import ErrorCard from "@/components/admin/shared/ErrorCard";
import Pagination from "@/components/admin/shared/Pagination";

export default function JobApplicantsPage() {
  const {
    jobId,
    filters,
    setFilters,
    limit,
    setLimit,
    page,
    setPage,
    data,
    loading,
    error,
    fetchData,
    handleApplyFilters,
    onUpdateStatus,
    getStatusColor,
  } = useApplicantsData();

  const totalPages = Math.max(1, Math.ceil(data.total / limit));

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b bg-gradient-to-r from-primary-50 to-secondary-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link href="/admin/jobs">
                <Button variant="outline" size="icon" className="rounded-xl">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-semibold">
                  Applicants for Job #{jobId}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Review and manage applications
                </p>
              </div>
            </div>
            <Button
              onClick={fetchData}
              disabled={loading}
              className="gap-2 bg-[#467EC7] hover:bg-[#578BCC] shadow-md"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        <ApplicantStats data={data} />

        <ApplicantFilters
          filters={filters}
          limit={limit}
          onFiltersChange={setFilters}
          onLimitChange={setLimit}
          onApplyFilters={handleApplyFilters}
        />

        {/* Applicants List */}
        {loading ? (
          <LoadingSpinner message="Loading applicants..." />
        ) : error ? (
          <ErrorCard message={error} />
        ) : data.items.length === 0 ? (
          <EmptyApplicantsState />
        ) : (
          <>
            {/* Mobile view */}
            <div className="grid gap-4 md:hidden">
              {data.items.map((a, index) => (
                <ApplicantCard
                  key={a.applicationId}
                  applicant={a}
                  index={index}
                  onUpdateStatus={onUpdateStatus}
                  getStatusColor={getStatusColor}
                />
              ))}
            </div>

            {/* Desktop table view */}
            <Card className="hidden md:block shadow-md overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-primary-50 to-secondary-50">
                      <tr>
                        <th className="text-left p-4 font-semibold">
                          Applicant
                        </th>
                        <th className="text-left p-4 font-semibold">
                          Education
                        </th>
                        <th className="text-left p-4 font-semibold">Age</th>
                        <th className="text-left p-4 font-semibold">
                          Expected Salary
                        </th>
                        <th className="text-left p-4 font-semibold">
                          Test Score
                        </th>
                        <th className="text-left p-4 font-semibold">Status</th>
                        <th className="text-left p-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {data.items.map((a) => (
                        <ApplicantTableRow
                          key={a.applicationId}
                          applicant={a}
                          onUpdateStatus={onUpdateStatus}
                          getStatusColor={getStatusColor}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Pagination */}
        {data.items.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
