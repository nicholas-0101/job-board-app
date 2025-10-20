"use client";
import { useState, useEffect, useMemo } from "react";
import { listCompanyJobs, JobItemDTO } from "@/lib/jobs";
import { listJobApplicants, updateApplicantStatus, ApplicantDTO } from "@/lib/applicants";
import { apiCall } from "@/helper/axios";

export type SortBy = "appliedAt" | "expectedSalary" | "age";
export type SortOrder = "asc" | "desc";

export function useApplicantsPageState() {
  const [companyId, setCompanyId] = useState<number>(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem("companyId") : null;
    return raw ? Number(raw) : NaN;
  });

  const [loading, setLoading] = useState(true);
  const [applicants, setApplicants] = useState<ApplicantDTO[]>([]);
  const [total, setTotal] = useState(0);
  const [jobs, setJobs] = useState<JobItemDTO[]>([]);

  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [searchName, setSearchName] = useState("");
  const [education, setEducation] = useState("");
  const [ageMin, setAgeMin] = useState("");
  const [ageMax, setAgeMax] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("appliedAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const fetchCompanyId = async () => {
    if (!companyId || Number.isNaN(companyId)) {
      try {
        const resp = await apiCall.get("/company/admin");
        const data = resp.data?.data ?? resp.data;
        const resolved = Number(data?.id ?? data?.data?.id);
        if (resolved) {
          setCompanyId(resolved);
          if (typeof window !== "undefined") localStorage.setItem("companyId", resolved.toString());
          return resolved;
        }
      } catch {}
    }
    return companyId;
  };

  const fetchJobs = async (cid: number) => {
    try {
      const response = await listCompanyJobs({ companyId: cid, limit: 100, offset: 0 });
      setJobs(response.items);
      if (response.items.length > 0 && !selectedJobId) {
        setSelectedJobId(response.items[0].id);
      }
    } catch (err) {
      console.error("Failed to load jobs:", err);
    }
  };

  const fetchApplicants = async () => {
    if (!selectedJobId) return;
    setLoading(true);
    try {
      const cid = await fetchCompanyId();
      if (!cid || Number.isNaN(cid)) throw new Error("Company not found");
      const response = await listJobApplicants({
        companyId: cid,
        jobId: selectedJobId,
        name: searchName || undefined,
        education: education || undefined,
        ageMin: ageMin ? Number(ageMin) : undefined,
        ageMax: ageMax ? Number(ageMax) : undefined,
        expectedSalaryMin: salaryMin ? Number(salaryMin) : undefined,
        expectedSalaryMax: salaryMax ? Number(salaryMax) : undefined,
        sortBy,
        sortOrder,
        limit,
        offset: (page - 1) * limit,
      });
      setApplicants(response.items);
      setTotal(response.total);
    } catch (err: any) {
      console.error("Failed to load applicants:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      const cid = await fetchCompanyId();
      if (cid && !Number.isNaN(cid)) {
        await fetchJobs(cid);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedJobId) {
      fetchApplicants();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedJobId, sortBy, sortOrder, page]);

  const handleApplyFilters = () => {
    setPage(1);
    fetchApplicants();
  };

  const handleUpdateStatus = async (applicationId: number, newStatus: string) => {
    if (!confirm(`Are you sure you want to change status to ${newStatus}?`)) return;
    try {
      const cid = await fetchCompanyId();
      if (!cid || Number.isNaN(cid) || !selectedJobId) return;
      await updateApplicantStatus({ companyId: cid, jobId: selectedJobId, applicationId, status: newStatus });
      fetchApplicants();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to update status");
    }
  };

  const stats = useMemo(
    () => [
      { label: "Total Applicants", value: total, icon: undefined, color: "from-blue-500 to-blue-600" },
      { label: "Priority Applications", value: applicants.filter((a) => a.isPriority).length, icon: undefined, color: "from-amber-500 to-yellow-600" },
      { label: "Pending Review", value: applicants.filter((a) => a.status === "SUBMITTED").length, icon: undefined, color: "from-yellow-500 to-yellow-600" },
      { label: "Interview Stage", value: applicants.filter((a) => a.status === "INTERVIEW").length, icon: undefined, color: "from-purple-500 to-purple-600" },
      { label: "Accepted", value: applicants.filter((a) => a.status === "ACCEPTED").length, icon: undefined, color: "from-green-500 to-green-600" },
    ],
    [applicants, total]
  );

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    companyId,
    loading,
    applicants,
    total,
    jobs,
    selectedJobId,
    setSelectedJobId,
    searchName,
    setSearchName,
    education,
    setEducation,
    ageMin,
    setAgeMin,
    ageMax,
    setAgeMax,
    salaryMin,
    setSalaryMin,
    salaryMax,
    setSalaryMax,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    page,
    setPage,
    limit,
    fetchApplicants,
    handleApplyFilters,
    handleUpdateStatus,
    stats,
    totalPages,
  } as const;
}


