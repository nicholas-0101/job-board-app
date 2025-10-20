"use client";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Users,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Search,
  Calendar,
  MapPin,
  GraduationCap,
  DollarSign,
  RefreshCw,
  Filter,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ApplicantsHeader } from "./components/ApplicantsHeader";
import { ApplicantStatsGrid, StatItem } from "./components/ApplicantStatsGrid";
import { ApplicantFilters } from "./components/ApplicantFilters";
import { ApplicantsList } from "./components/ApplicantsList";
import { ApplicantsPagination } from "./components/ApplicantsPagination";
import { listCompanyJobs, JobItemDTO } from "@/lib/jobs";
import {
  listJobApplicants,
  updateApplicantStatus,
  ApplicantDTO,
} from "@/lib/applicants";
import { apiCall } from "@/helper/axios";

export default function ApplicantsPage() {
  const [companyId, setCompanyId] = useState<number>(() => {
    const raw = localStorage.getItem("companyId");
    return raw ? Number(raw) : NaN;
  });

  const [loading, setLoading] = useState(true);
  const [applicants, setApplicants] = useState<ApplicantDTO[]>([]);
  const [total, setTotal] = useState(0);
  const [jobs, setJobs] = useState<JobItemDTO[]>([]);

  // Filters
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [searchName, setSearchName] = useState("");
  const [education, setEducation] = useState("");
  const [ageMin, setAgeMin] = useState("");
  const [ageMax, setAgeMax] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [sortBy, setSortBy] = useState<"appliedAt" | "expectedSalary" | "age">(
    "appliedAt"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
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
          localStorage.setItem("companyId", resolved.toString());
          return resolved;
        }
      } catch {}
    }
    return companyId;
  };

  const fetchJobs = async (cid: number) => {
    try {
      const response = await listCompanyJobs({
        companyId: cid,
        limit: 100,
        offset: 0,
      });
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

  const handleUpdateStatus = async (
    applicationId: number,
    newStatus: string
  ) => {
    if (!confirm(`Are you sure you want to change status to ${newStatus}?`))
      return;

    try {
      const cid = await fetchCompanyId();
      if (!cid || Number.isNaN(cid) || !selectedJobId) return;

      await updateApplicantStatus({
        companyId: cid,
        jobId: selectedJobId,
        applicationId,
        status: newStatus,
      });

      fetchApplicants();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to update status");
    }
  };

  const stats = useMemo(
    () => [
      {
        label: "Total Applicants",
        value: total,
        icon: Users,
        color: "from-blue-500 to-blue-600",
      },
      {
        label: "Priority Applications",
        value: applicants.filter((a) => a.isPriority).length,
        icon: Star,
        color: "from-amber-500 to-yellow-600",
      },
      {
        label: "Pending Review",
        value: applicants.filter((a) => a.status === "SUBMITTED").length,
        icon: Clock,
        color: "from-yellow-500 to-yellow-600",
      },
      {
        label: "Interview Stage",
        value: applicants.filter((a) => a.status === "INTERVIEW").length,
        icon: Calendar,
        color: "from-purple-500 to-purple-600",
      },
      {
        label: "Accepted",
        value: applicants.filter((a) => a.status === "ACCEPTED").length,
        icon: CheckCircle,
        color: "from-green-500 to-green-600",
      },
    ],
    [applicants, total]
  );

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

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="min-h-screen">
      <ApplicantsHeader loading={loading} onRefresh={fetchApplicants} />

      <div className="container mx-auto px-4 py-6 space-y-6">
        <ApplicantStatsGrid stats={stats as unknown as StatItem[]} />

        <ApplicantFilters
          jobs={jobs}
          selectedJobId={selectedJobId}
          setSelectedJobId={(id:number)=>setSelectedJobId(id)}
          searchName={searchName}
          setSearchName={setSearchName}
          education={education}
          setEducation={setEducation}
          sortBy={sortBy}
          setSortBy={setSortBy as any}
          ageMin={ageMin}
          setAgeMin={setAgeMin}
          ageMax={ageMax}
          setAgeMax={setAgeMax}
          salaryMin={salaryMin}
          setSalaryMin={setSalaryMin}
          salaryMax={salaryMax}
          setSalaryMax={setSalaryMax}
          onApply={handleApplyFilters}
        />

        <ApplicantsList
          applicants={applicants as any}
          loading={loading}
          onUpdateStatus={handleUpdateStatus}
        />

        <ApplicantsPagination
          page={page}
          totalPages={totalPages}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
        />
      </div>
    </div>
  );
}
