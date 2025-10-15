"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Users, RefreshCw, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { listCompanyJobs, JobItemDTO } from "@/lib/jobs";
import {
  listJobApplicants,
  updateApplicantStatus,
  ApplicantDTO,
} from "@/lib/applicants";
import { apiCall } from "@/helper/axios";
import ApplicantFilters from "./components/ApplicantFilters";
import JobSelector from "./components/JobSelector";
import SortControls from "./components/SortControls";
import { ApplicantsHeader } from "./components/ApplicantsHeader";
import { ApplicantsContent } from "./components/ApplicantsContent";

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

  const stats = [
    { label: "Total Applicants", value: total, icon: Users, color: "from-blue-500 to-blue-600" },
    { label: "Priority Applications", value: applicants.filter((a) => a.isPriority).length, icon: Users, color: "from-amber-500 to-yellow-600" },
    { label: "Pending Review", value: applicants.filter((a) => a.status === "SUBMITTED").length, icon: Users, color: "from-yellow-500 to-yellow-600" },
    { label: "Interview Stage", value: applicants.filter((a) => a.status === "INTERVIEW").length, icon: Users, color: "from-purple-500 to-purple-600" },
    { label: "Accepted", value: applicants.filter((a) => a.status === "ACCEPTED").length, icon: Users, color: "from-green-500 to-green-600" },
  ];

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b bg-gradient-to-r from-primary-50 to-secondary-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold">Applicant Management</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Review and manage job applicants
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={fetchApplicants}
                disabled={loading}
                className="gap-2 bg-[#467EC7] hover:bg-[#578BCC]"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Link href="/admin/jobs">
                <Button variant="outline" className="gap-2">
                  <FileText className="w-4 h-4" />
                  Manage Jobs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="shadow-md">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-semibold">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">
                          {stat.label}
                        </p>
                      </div>
                      <div
                        className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}
                      >
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <JobSelector
              jobs={jobs}
              selectedJobId={selectedJobId}
              onJobSelect={setSelectedJobId}
            />
          </div>
          <div className="lg:col-span-3">
            <ApplicantFilters
              searchName={searchName}
              setSearchName={setSearchName}
              education={education}
              setEducation={setEducation}
              ageMin={ageMin}
              setAgeMin={setAgeMin}
              ageMax={ageMax}
              setAgeMax={setAgeMax}
              salaryMin={salaryMin}
              setSalaryMin={setSalaryMin}
              salaryMax={salaryMax}
              setSalaryMax={setSalaryMax}
              onApplyFilters={handleApplyFilters}
            />
          </div>
        </div>

        <SortControls
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />

        {/* Applicants List */}
        <ApplicantsContent
          applicants={applicants}
          loading={loading}
          total={total}
          page={page}
          limit={limit}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={setSortBy}
          onSortOrderChange={setSortOrder}
          onPageChange={setPage}
          onStatusUpdate={handleUpdateStatus}
        />
      </div>
    </div>
  );
}
