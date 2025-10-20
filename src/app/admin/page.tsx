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
import { OverviewHeader } from "./components/OverviewHeader";
import { CompanyBanner } from "./components/CompanyBanner";
import { OverviewStatsGrid } from "./components/OverviewStatsGrid";
import { RecentJobsCard } from "./components/RecentJobsCard";
import { UpcomingInterviewsCard } from "./components/UpcomingInterviewsCard";
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
        console.warn("No valid company ID found - showing empty dashboard");
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
        console.error("Error fetching jobs/interviews:", e);
        
        // Handle specific error cases
        if (e?.response?.status === 401) {
          console.warn("Unauthorized access to company jobs - company may not exist or admin may not have access");
        } else if (e?.response?.status === 404) {
          console.warn("Company not found - clearing stored company ID");
          localStorage.removeItem("companyId");
        } else {
          console.warn("Network or other error fetching jobs/interviews:", e?.message);
        }
        
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
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:py-8">
        <OverviewHeader loading={loading} onRefresh={fetchDashboardData} companyInfo={companyInfo} />

        <CompanyBanner companyInfo={companyInfo} />

      <div className="space-y-6">
        <OverviewStatsGrid stats={stats as any} loading={loading} />

        {/* Recent Jobs & Upcoming Interviews */}
        <div className="grid gap-6 md:grid-cols-2">
          <RecentJobsCard jobs={recentJobs} loading={loading} />
          <UpcomingInterviewsCard interviews={upcomingInterviews} loading={loading} />
        </div>
      </div>
    </div>
  </div>
);
}
