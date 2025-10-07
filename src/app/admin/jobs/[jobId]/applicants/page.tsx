"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft, Users, Eye, RefreshCw, Search, Filter,
  FileText, DollarSign, GraduationCap, Calendar, MapPin, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { listJobApplicants, updateApplicantStatus, ApplicantDTO } from "@/lib/applicants";
import { apiCall } from "@/helper/axios";

export default function JobApplicantsPage() {
  const params = useParams<{ jobId: string }>();
  const router = useRouter();
  const jobId = Number(params.jobId);
  
  const [companyId, setCompanyId] = useState<number>(() => {
    const raw = localStorage.getItem("companyId");
    return raw ? Number(raw) : NaN;
  });

  const [jobTitle, setJobTitle] = useState("");
  const [filters, setFilters] = useState({
    name: "",
    education: "",
    ageMin: "",
    ageMax: "",
    expectedSalaryMin: "",
    expectedSalaryMax: "",
    sortBy: "appliedAt" as "appliedAt" | "expectedSalary" | "age",
    sortOrder: "desc" as "asc" | "desc",
  });

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const offset = useMemo(() => (page - 1) * limit, [page, limit]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{ total: number; items: ApplicantDTO[] }>({ total: 0, items: [] });

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
        expectedSalaryMin: filters.expectedSalaryMin ? Number(filters.expectedSalaryMin) : undefined,
        expectedSalaryMax: filters.expectedSalaryMax ? Number(filters.expectedSalaryMax) : undefined,
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

  const onUpdateStatus = async (applicationId: number, status: "IN_REVIEW" | "INTERVIEW" | "ACCEPTED" | "REJECTED") => {
    const label = status === 'REJECTED' ? 'reject' : status === 'ACCEPTED' ? 'accept' : status === 'INTERVIEW' ? 'move to interview' : 'set to in-review';
    if (!confirm(`Are you sure you want to ${label} this applicant?`)) return;
    
    try {
      const cid = await fetchCompanyId();
      if (!cid || Number.isNaN(cid)) return;

      await updateApplicantStatus({ companyId: cid, jobId, applicationId, status });
      fetchData();
    } catch (e: any) {
      alert(e?.response?.data?.message || "Failed to update status");
    }
  };

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
                <h1 className="text-2xl font-semibold">Applicants for Job #{jobId}</h1>
                <p className="text-sm text-muted-foreground mt-1">Review and manage applications</p>
              </div>
            </div>
            <Button onClick={fetchData} disabled={loading} className="gap-2 bg-[#467EC7] hover:bg-[#578BCC] shadow-md">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Applicants", value: data.total, icon: Users, color: "from-blue-500 to-blue-600" },
            { label: "Submitted", value: data.items.filter(a => a.status === "SUBMITTED").length, icon: Clock, color: "from-yellow-500 to-yellow-600" },
            { label: "In Interview", value: data.items.filter(a => a.status === "INTERVIEW").length, icon: Calendar, color: "from-purple-500 to-purple-600" },
            { label: "Accepted", value: data.items.filter(a => a.status === "ACCEPTED").length, icon: Users, color: "from-green-500 to-green-600" },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <Card className="shadow-md">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-semibold">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                      </div>
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                        <Icon className="w-5 h-5 text-white" />
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
            <div className="grid gap-3 md:grid-cols-6 mb-3">
              <Input value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} placeholder="Name" className="rounded-xl" />
              <Input value={filters.education} onChange={(e) => setFilters({ ...filters, education: e.target.value })} placeholder="Education" className="rounded-xl" />
              <Input type="number" value={filters.ageMin} onChange={(e) => setFilters({ ...filters, ageMin: e.target.value })} placeholder="Min Age" className="rounded-xl" />
              <Input type="number" value={filters.ageMax} onChange={(e) => setFilters({ ...filters, ageMax: e.target.value })} placeholder="Max Age" className="rounded-xl" />
              <Input type="number" value={filters.expectedSalaryMin} onChange={(e) => setFilters({ ...filters, expectedSalaryMin: e.target.value })} placeholder="Min Salary" className="rounded-xl" />
              <Input type="number" value={filters.expectedSalaryMax} onChange={(e) => setFilters({ ...filters, expectedSalaryMax: e.target.value })} placeholder="Max Salary" className="rounded-xl" />
            </div>
            <div className="grid gap-3 md:grid-cols-4">
              <select value={filters.sortBy} onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })} className="px-3 py-2 border rounded-xl bg-background">
                <option value="appliedAt">Sort: Applied Date</option>
                <option value="expectedSalary">Sort: Expected Salary</option>
                <option value="age">Sort: Age</option>
              </select>
              <select value={filters.sortOrder} onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value as any })} className="px-3 py-2 border rounded-xl bg-background">
                <option value="desc">Order: Desc</option>
                <option value="asc">Order: Asc</option>
              </select>
              <select value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="px-3 py-2 border rounded-xl bg-background">
                {[5,10,20,50].map((n) => <option key={n} value={n}>{n} per page</option>)}
              </select>
              <Button onClick={handleApplyFilters} className="bg-[#24CFA7] hover:bg-[#1fc39c]">
                <Search className="w-4 h-4 mr-2" />
                Apply
              </Button>
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
        ) : error ? (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6 text-center">
              <p className="text-red-600 font-medium">{error}</p>
            </CardContent>
          </Card>
        ) : data.items.length === 0 ? (
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
          <>
            {/* Mobile view */}
            <div className="grid gap-4 md:hidden">
              {data.items.map((a, index) => (
                <motion.div
                  key={a.applicationId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="shadow-md hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <img src={a.profilePicture || "/fallback_pfp_image.jpg"} alt={a.userName} className="w-12 h-12 rounded-full object-cover border-2 border-gray-200" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold truncate">{a.userName}</h4>
                          <p className="text-xs text-muted-foreground truncate">{a.userEmail}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(a.status)}`}>
                          {a.status}
                        </span>
                      </div>
                      
                      {a.score !== null && (
                        <div className="mb-3">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            a.preselectionPassed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            Test: {a.score}/25 {a.preselectionPassed ? '✓ Passed' : '✗ Failed'}
                          </span>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                        {a.expectedSalary && (
                          <div className="text-muted-foreground">
                            💰 Rp {a.expectedSalary.toLocaleString()}
                          </div>
                        )}
                        <div className="text-muted-foreground">
                          📅 {new Date(a.appliedAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        {a.cvFile && (
                          <a href={a.cvFile} target="_blank" rel="noreferrer">
                            <Button size="sm" variant="outline" className="hover:bg-secondary">
                              <Eye className="w-4 h-4 mr-1" />
                              CV
                            </Button>
                          </a>
                        )}
                        <Button size="sm" onClick={() => onUpdateStatus(a.applicationId, "INTERVIEW")} className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                          Interview
                        </Button>
                        <Button size="sm" onClick={() => onUpdateStatus(a.applicationId, "ACCEPTED")} className="bg-green-100 text-green-700 hover:bg-green-200">
                          Accept
                        </Button>
                        <Button size="sm" onClick={() => onUpdateStatus(a.applicationId, "REJECTED")} className="bg-red-100 text-red-700 hover:bg-red-200">
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Desktop table view */}
            <Card className="hidden md:block shadow-md overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-primary-50 to-secondary-50">
                      <tr>
                        <th className="text-left p-4 font-semibold">Applicant</th>
                        <th className="text-left p-4 font-semibold">Education</th>
                        <th className="text-left p-4 font-semibold">Age</th>
                        <th className="text-left p-4 font-semibold">Expected Salary</th>
                        <th className="text-left p-4 font-semibold">Test Score</th>
                        <th className="text-left p-4 font-semibold">Status</th>
                        <th className="text-left p-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {data.items.map((a) => (
                        <tr key={a.applicationId} className="hover:bg-secondary/50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img src={a.profilePicture || "/fallback_pfp_image.jpg"} alt={a.userName} className="w-10 h-10 rounded-full object-cover border-2 border-gray-200" />
                              <div>
                                <div className="font-medium">{a.userName}</div>
                                <div className="text-xs text-muted-foreground">{a.userEmail}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-sm">{(a as any).education || "-"}</td>
                          <td className="p-4 text-sm">{(a as any).age || "-"}</td>
                          <td className="p-4 text-sm">
                            {a.expectedSalary ? `Rp ${a.expectedSalary.toLocaleString()}` : "-"}
                          </td>
                          <td className="p-4">
                            {a.score !== null ? (
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                a.preselectionPassed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}>
                                {a.score}/25 {a.preselectionPassed ? '✓' : '✗'}
                              </span>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(a.status)}`}>
                              {a.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              {a.cvFile && (
                                <a href={a.cvFile} target="_blank" rel="noreferrer">
                                  <Button size="sm" variant="outline" className="hover:bg-secondary">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </a>
                              )}
                              <Button size="sm" onClick={() => onUpdateStatus(a.applicationId, "INTERVIEW")} className="bg-purple-100 text-purple-700 hover:bg-purple-200 text-xs">
                                Interview
                              </Button>
                              <Button size="sm" onClick={() => onUpdateStatus(a.applicationId, "ACCEPTED")} className="bg-green-100 text-green-700 hover:bg-green-200 text-xs">
                                Accept
                              </Button>
                              <Button size="sm" onClick={() => onUpdateStatus(a.applicationId, "REJECTED")} className="bg-red-100 text-red-700 hover:bg-red-200 text-xs">
                                Reject
                              </Button>
                            </div>
                          </td>
                        </tr>
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
          <div className="flex items-center justify-center gap-2">
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
