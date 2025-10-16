import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { listJobApplicants, updateApplicantStatus, ApplicantDTO } from "@/lib/applicants";
import { useCompanyId } from "@/hooks/useCompanyId";

interface ApplicantFilters {
  name: string;
  education: string;
  ageMin: string;
  ageMax: string;
  expectedSalaryMin: string;
  expectedSalaryMax: string;
  sortBy: "appliedAt" | "expectedSalary" | "age";
  sortOrder: "asc" | "desc";
}

export function useApplicantsData() {
  const params = useParams<{ jobId: string }>();
  const jobId = Number(params.jobId);
  const { companyId, fetchCompanyId } = useCompanyId();

  const [filters, setFilters] = useState<ApplicantFilters>({
    name: "",
    education: "",
    ageMin: "",
    ageMax: "",
    expectedSalaryMin: "",
    expectedSalaryMax: "",
    sortBy: "appliedAt",
    sortOrder: "desc",
  });

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const offset = useMemo(() => (page - 1) * limit, [page, limit]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{ total: number; items: ApplicantDTO[] }>({
    total: 0,
    items: [],
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const cid = await fetchCompanyId();
      if (!cid || Number.isNaN(cid)) throw new Error("Company not found");

      const res = await listJobApplicants({
        companyId: cid,
        jobId,
        name: filters.name || undefined,
        education: filters.education || undefined,
        ageMin: filters.ageMin ? Number(filters.ageMin) : undefined,
        ageMax: filters.ageMax ? Number(filters.ageMax) : undefined,
        expectedSalaryMin: filters.expectedSalaryMin
          ? Number(filters.expectedSalaryMin)
          : undefined,
        expectedSalaryMax: filters.expectedSalaryMax
          ? Number(filters.expectedSalaryMax)
          : undefined,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        limit,
        offset,
      });
      setData({ total: res.total, items: res.items });
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to load applicants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [companyId, jobId, filters.sortBy, filters.sortOrder, limit, offset]);

  const handleApplyFilters = () => {
    setPage(1);
    fetchData();
  };

  const onUpdateStatus = async (
    applicationId: number,
    status: "IN_REVIEW" | "INTERVIEW" | "ACCEPTED" | "REJECTED"
  ) => {
    const label =
      status === "REJECTED"
        ? "reject"
        : status === "ACCEPTED"
        ? "accept"
        : status === "INTERVIEW"
        ? "move to interview"
        : "set to in-review";
    if (!confirm(`Are you sure you want to ${label} this applicant?`)) return;

    try {
      const cid = await fetchCompanyId();
      if (!cid || Number.isNaN(cid)) return;

      await updateApplicantStatus({
        companyId: cid,
        jobId,
        applicationId,
        status,
      });
      fetchData();
    } catch (e: any) {
      alert(e?.response?.data?.message || "Failed to update status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return "bg-yellow-100 text-yellow-700";
      case "IN_REVIEW":
        return "bg-blue-100 text-blue-700";
      case "INTERVIEW":
        return "bg-purple-100 text-purple-700";
      case "ACCEPTED":
        return "bg-green-100 text-green-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return {
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
  };
}
