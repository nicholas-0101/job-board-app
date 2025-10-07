"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Users,
  Briefcase,
  Calendar,
  TrendingUp,
  DollarSign,
  Clock,
  MapPin,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  Settings,
  BarChart3,
  FileText,
  UserCheck,
  Mail,
  TestTube,
  RefreshCw,
  ExternalLink,
  Building2,
} from "lucide-react";
import { AnimatedCounter } from "../../components/ui/AnimatedCounter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { listCompanyJobs } from "@/lib/jobs";
import { listCompanyInterviews } from "@/lib/interviews";
import { apiCall } from "@/helper/axios";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [realStats, setRealStats] = useState({
    totalJobs: 0,
    publishedJobs: 0,
    totalApplicants: 0,
    totalInterviews: 0,
  });
  const [companyInfo, setCompanyInfo] = useState<any>(null);
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState<any[]>([]);

  const companyId = useState<number>(() => {
    const raw = localStorage.getItem("companyId");
    return raw ? Number(raw) : NaN;
  })[0];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Ensure valid companyId (fetch from backend if not present)
      let cid = companyId;
      if (!cid || Number.isNaN(cid)) {
        try {
          const resp = await apiCall.get("/company/admin");
          const data = resp.data?.data ?? resp.data;
          const resolved = Number(data?.id ?? data?.data?.id);
          if (resolved) {
            cid = resolved;
            localStorage.setItem("companyId", cid.toString());
            setCompanyInfo(data); // Store company info for display
          }
        } catch (err) {
          console.error("Failed to fetch company:", err);
          // Company doesn't exist yet - that's ok
          setCompanyInfo(null);
        }
      } else {
        // Fetch company info even if we have ID
        try {
          const resp = await apiCall.get("/company/admin");
          const data = resp.data?.data ?? resp.data;
          setCompanyInfo(data);
        } catch (err) {
          console.error("Failed to fetch company:", err);
          setCompanyInfo(null);
        }
      }

      if (!cid || Number.isNaN(cid)) {
        // No company yet - show empty state
        console.log("Company not found, admin should complete profile");
        setLoading(false);
        return;
      }

      let jobsResponse, interviewsResponse;
      try {
        [jobsResponse, interviewsResponse] = await Promise.all([
          listCompanyJobs({ companyId: cid, limit: 100, offset: 0 }),
          listCompanyInterviews({ companyId: cid, limit: 100, offset: 0 }),
        ]);
      } catch (e: any) {
        // Fallback in case stale companyId (e.g., 16) is stored
        try {
          const resp = await apiCall.get("/company/admin");
          const data = resp.data?.data ?? resp.data;
          const newCid = Number(data?.id ?? data?.data?.id);
          if (newCid && newCid !== cid) {
            localStorage.setItem("companyId", newCid.toString());
            cid = newCid;
            [jobsResponse, interviewsResponse] = await Promise.all([
              listCompanyJobs({ companyId: cid, limit: 100, offset: 0 }),
              listCompanyInterviews({ companyId: cid, limit: 100, offset: 0 }),
            ]);
          } else {
            throw e;
          }
        } catch {
          throw e;
        }
      }

      const totalJobs = jobsResponse.total;
      const publishedJobs = jobsResponse.items.filter(
        (job) => job.isPublished
      ).length;
      const totalApplicants = jobsResponse.items.reduce(
        (sum, job) => sum + (job.applicantsCount || 0),
        0
      );
      const totalInterviews = interviewsResponse.total;

      setRealStats({
        totalJobs,
        publishedJobs,
        totalApplicants,
        totalInterviews,
      });

      // Store recent jobs and upcoming interviews
      setRecentJobs(jobsResponse.items.slice(0, 5));
      setUpcomingInterviews(interviewsResponse.items.slice(0, 5));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      label: "Total Jobs",
      value: realStats.totalJobs,
      icon: Briefcase,
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Published Jobs",
      value: realStats.publishedJobs,
      icon: CheckCircle,
      color: "from-green-500 to-green-600",
    },
    {
      label: "Total Applicants",
      value: realStats.totalApplicants,
      icon: Users,
      color: "from-purple-500 to-purple-600",
    },
    {
      label: "Scheduled Interviews",
      value: realStats.totalInterviews,
      icon: Calendar,
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b bg-gradient-to-r from-primary-50 to-secondary-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your job board platform
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={fetchDashboardData}
                disabled={loading}
                className="gap-2 bg-[#467EC7] hover:bg-[#578BCC] shadow-md"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              {companyInfo && (
                <Link href="/admin/jobs/new">
                  <Button className="gap-2 bg-[#24CFA7] hover:bg-[#1fc39c] shadow-md">
                    <Plus className="w-5 h-5" />
                    Post New Job
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Company Info Banner */}
      {companyInfo && (
        <div className="container mx-auto px-4 py-6">
          <Card className="shadow-lg border-l-4 border-l-[#24CFA7] bg-gradient-to-r from-white to-primary-50/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                {companyInfo.logoUrl ? (
                  <img
                    src={companyInfo.logoUrl}
                    alt={companyInfo.name}
                    className="w-20 h-20 rounded-xl object-cover border-2 border-[#24CFA7] shadow-md"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#24CFA7] to-[#467EC7] flex items-center justify-center shadow-md">
                    <Building2 className="w-10 h-10 text-white" />
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1">
                    {companyInfo.name}
                  </h2>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      📧 {companyInfo.email}
                    </span>
                    {companyInfo.locationCity && (
                      <span className="flex items-center gap-1">
                        📍 {companyInfo.locationCity}
                      </span>
                    )}
                    {companyInfo.website && (
                      <a
                        href={companyInfo.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[#467EC7] hover:underline"
                      >
                        🌐 Website
                      </a>
                    )}
                  </div>
                  {companyInfo.description && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {companyInfo.description.replace(/<[^>]*>/g, "")}
                    </p>
                  )}
                </div>
                <Link href="/admin/profile/edit">
                  <Button className="gap-2 bg-[#24CFA7] hover:bg-[#1fc39c] shadow-md">
                    <Edit className="w-4 h-4" />
                    Edit Company
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="container mx-auto px-4 py-6">
        {/* Stats Overview */}
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
                        <div className="text-2xl font-semibold">
                          {loading ? (
                            <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                          ) : (
                            <AnimatedCounter end={stat.value} />
                          )}
                        </div>
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

        {/* Recent Jobs & Upcoming Interviews */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Jobs */}
          <Card className="shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-[#467EC7]" />
                  Recent Job Postings
                </CardTitle>
                <Link href="/admin/jobs">
                  <Button size="sm" variant="ghost" className="text-xs">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="animate-pulse p-3 bg-secondary rounded-xl"
                    >
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : recentJobs.length > 0 ? (
                <div className="space-y-3">
                  {recentJobs.map((job, index) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link href={`/admin/jobs/${job.id}/edit`}>
                        <div className="p-3 bg-secondary/50 hover:bg-secondary rounded-xl transition-all cursor-pointer border border-transparent hover:border-[#24CFA7]">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm truncate">
                                {job.title}
                              </h4>
                              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {job.city}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {job.applicantsCount} applicants
                                </span>
                              </div>
                            </div>
                            {job.isPublished ? (
                              <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700 font-medium">
                                Published
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-700 font-medium">
                                Draft
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No jobs yet</p>
                  <Link href="/admin/jobs/new">
                    <Button
                      size="sm"
                      className="mt-2 bg-[#24CFA7] hover:bg-[#1fc39c]"
                    >
                      Create Job
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Interviews */}
          <Card className="shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#24CFA7]" />
                  Upcoming Interviews
                </CardTitle>
                <Link href="/admin/interviews">
                  <Button size="sm" variant="ghost" className="text-xs">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="animate-pulse p-3 bg-secondary rounded-xl"
                    >
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : upcomingInterviews.length > 0 ? (
                <div className="space-y-3">
                  {upcomingInterviews.map((interview, index) => (
                    <motion.div
                      key={interview.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 bg-secondary/50 hover:bg-secondary rounded-xl transition-all border border-transparent hover:border-[#467EC7]"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm truncate">
                            {interview.candidateName}
                          </h4>
                          <div className="flex flex-col gap-1 mt-1 text-xs text-muted-foreground">
                            <span className="truncate">
                              {interview.jobTitle}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(
                                interview.scheduleDate
                              ).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700 font-medium">
                          {interview.status}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No upcoming interviews</p>
                  <Link href="/admin/interviews">
                    <Button
                      size="sm"
                      className="mt-2 bg-[#24CFA7] hover:bg-[#1fc39c]"
                    >
                      Schedule Interview
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
