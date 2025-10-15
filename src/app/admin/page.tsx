"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { listCompanyJobs } from "@/lib/jobs";
import { listCompanyInterviews } from "@/lib/interviews";
import { apiCall } from "@/helper/axios";
import { StatsOverview } from "./components/StatsOverview";
import { CompanyInfoBanner } from "./components/CompanyInfoBanner";
import { RecentJobsCard } from "./components/RecentJobsCard";
import { UpcomingInterviewsCard } from "./components/UpcomingInterviewsCard";

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
      <CompanyInfoBanner companyInfo={companyInfo} />

      <div className="container mx-auto px-4 py-6">
        {/* Stats Overview */}
        <StatsOverview loading={loading} stats={realStats} />

        {/* Recent Jobs & Upcoming Interviews */}
        <div className="grid gap-6 md:grid-cols-2">
          <RecentJobsCard loading={loading} recentJobs={recentJobs} />
          <UpcomingInterviewsCard loading={loading} upcomingInterviews={upcomingInterviews} />
        </div>
      </div>
    </div>
  );
}
