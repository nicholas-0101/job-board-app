"use client";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Users, Eye, CheckCircle, XCircle, Clock, FileText, Search,
  Calendar, MapPin, GraduationCap, DollarSign, RefreshCw, Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { listCompanyJobs, JobItemDTO } from "@/lib/jobs";
import { listJobApplicants, updateApplicantStatus, ApplicantDTO } from "@/lib/applicants";
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
  const [sortBy, setSortBy] = useState<"appliedAt" | "expectedSalary" | "age">("appliedAt");
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
  }, []);

  useEffect(() => {
    if (selectedJobId) {
      fetchApplicants();
    }
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

  const stats = useMemo(() => [
    { 
      label: "Total Applicants", 
      value: total, 
      icon: Users, 
      color: "from-blue-500 to-blue-600" 
    },
    { 
      label: "Pending Review", 
      value: applicants.filter(a => a.status === "SUBMITTED").length, 
      icon: Clock, 
      color: "from-yellow-500 to-yellow-600" 
    },
    { 
      label: "Interview Stage", 
      value: applicants.filter(a => a.status === "INTERVIEW").length, 
      icon: Calendar, 
      color: "from-purple-500 to-purple-600" 
    },
    { 
      label: "Accepted", 
      value: applicants.filter(a => a.status === "ACCEPTED").length, 
      icon: CheckCircle, 
      color: "from-green-500 to-green-600" 
    }
  ], [applicants, total]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUBMITTED": return "bg-yellow-100 text-yellow-700";
      case "IN_REVIEW": return "bg-blue-100 text-blue-700";
      case "INTERVIEW": return "bg-purple-100 text-purple-700";
      case "ACCEPTED": return "bg-green-100 text-green-700";
      case "REJECTED": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b bg-gradient-to-r from-primary-50 to-secondary-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold">Applicant Management</h1>
              <p className="text-sm text-muted-foreground mt-1">Review and manage job applicants</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={fetchApplicants} disabled={loading} className="gap-2 bg-[#467EC7] hover:bg-[#578BCC]">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
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
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                      </div>
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Filters */}
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Filter className="w-5 h-5 text-[#467EC7]" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Job Position</label>
                <select
                  value={selectedJobId || ""}
                  onChange={(e) => setSelectedJobId(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-xl bg-background hover:border-primary transition-colors"
                >
                  {jobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Search Name</label>
                <Input
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder="Search by name..."
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Education</label>
                <Input
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  placeholder="e.g., S1, S2..."
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-xl bg-background hover:border-primary transition-colors"
                >
                  <option value="appliedAt">Applied Date</option>
                  <option value="expectedSalary">Expected Salary</option>
                  <option value="age">Age</option>
                </select>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-5">
              <div>
                <label className="block text-sm font-medium mb-2">Min Age</label>
                <Input
                  type="number"
                  value={ageMin}
                  onChange={(e) => setAgeMin(e.target.value)}
                  placeholder="Min"
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Max Age</label>
                <Input
                  type="number"
                  value={ageMax}
                  onChange={(e) => setAgeMax(e.target.value)}
                  placeholder="Max"
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Min Salary</label>
                <Input
                  type="number"
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(e.target.value)}
                  placeholder="Min"
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Max Salary</label>
                <Input
                  type="number"
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(e.target.value)}
                  placeholder="Max"
                  className="rounded-xl"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleApplyFilters} className="w-full bg-[#24CFA7] hover:bg-[#1fc39c]">
                  <Search className="w-4 h-4 mr-2" />
                  Apply Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applicants List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#24CFA7] mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading applicants...</p>
            </div>
          </div>
        ) : applicants.length === 0 ? (
          <Card className="border-dashed shadow-md">
            <CardContent className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-primary-100 rounded-full">
                  <Users className="w-10 h-10 text-[#467EC7]" />
                </div>
                <div>
                  <p className="text-lg font-medium text-foreground mb-1">No applicants yet</p>
                  <p className="text-muted-foreground">Applications will appear here when candidates apply</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {applicants.map((applicant, index) => (
              <motion.div
                key={applicant.applicationId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300 shadow-md">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <img
                        src={applicant.profilePicture || "/fallback_pfp_image.jpg"}
                        alt={applicant.userName}
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-foreground truncate">{applicant.userName}</h4>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(applicant.status)}`}>
                            {applicant.status}
                          </span>
                          {applicant.score !== null && (
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              applicant.preselectionPassed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              Test: {applicant.score}/25 {applicant.preselectionPassed ? '✓' : '✗'}
                            </span>
                          )}
                        </div>
                        <div className="grid md:grid-cols-3 gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            <span className="truncate">{applicant.userEmail}</span>
                          </div>
                          {applicant.expectedSalary && (
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4" />
                              <span>Rp {applicant.expectedSalary.toLocaleString()}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(applicant.appliedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {applicant.cvFile && (
                          <a
                            href={applicant.cvFile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition border border-blue-200"
                          >
                            <Eye className="w-5 h-5" />
                          </a>
                        )}
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStatus(applicant.applicationId, "INTERVIEW")}
                          className="bg-purple-100 text-purple-700 hover:bg-purple-200"
                          disabled={applicant.status === "INTERVIEW"}
                        >
                          Interview
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStatus(applicant.applicationId, "ACCEPTED")}
                          className="bg-green-100 text-green-700 hover:bg-green-200"
                          disabled={applicant.status === "ACCEPTED"}
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStatus(applicant.applicationId, "REJECTED")}
                          className="bg-red-100 text-red-700 hover:bg-red-200"
                          disabled={applicant.status === "REJECTED"}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {applicants.length > 0 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <Button 
              variant="outline" 
              disabled={page <= 1} 
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="hover:bg-[#467EC7] hover:text-white transition-colors rounded-xl"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="m15 18-6-6 6-6"/></svg>
              Prev
            </Button>
            <div className="px-4 py-2 bg-secondary rounded-xl">
              <span className="font-medium">Page {page}</span>
              <span className="text-muted-foreground"> of {totalPages}</span>
            </div>
            <Button 
              variant="outline" 
              disabled={page >= totalPages} 
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="hover:bg-[#467EC7] hover:text-white transition-colors rounded-xl"
            >
              Next
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><path d="m9 18 6-6-6-6"/></svg>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
