"use client";
import { useState, useEffect } from "react";
import { listCompanyJobs } from "@/lib/jobs";
import { listCompanyInterviews } from "@/lib/interviews";
import { apiCall } from "@/helper/axios";

export function useAdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [realStats, setRealStats] = useState({ totalJobs: 0, publishedJobs: 0, totalApplicants: 0, totalInterviews: 0 });
  const [companyInfo, setCompanyInfo] = useState<any>(null);
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState<any[]>([]);

  const companyId = useState<number>(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem("companyId") : null;
    return raw ? Number(raw) : NaN;
  })[0];

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      let cid = companyId;
      if (!cid || Number.isNaN(cid)) {
        try {
          const resp = await apiCall.get("/company/admin");
          const data = resp.data?.data ?? resp.data;
          const resolved = Number(data?.id ?? data?.data?.id);
          if (resolved) {
            cid = resolved;
            if (typeof window !== "undefined") localStorage.setItem("companyId", cid.toString());
            setCompanyInfo(data);
          }
        } catch (err) {
          console.error("Failed to fetch company:", err);
          setCompanyInfo(null);
        }
      } else {
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
        if (e?.response?.status === 401) {
          console.warn("Unauthorized access to company jobs - company may not exist or admin may not have access");
        } else if (e?.response?.status === 404) {
          console.warn("Company not found - clearing stored company ID");
          if (typeof window !== "undefined") localStorage.removeItem("companyId");
        } else {
          console.warn("Network or other error fetching jobs/interviews:", e?.message);
        }
        try {
          const resp = await apiCall.get("/company/admin");
          const data = resp.data?.data ?? resp.data;
          const newCid = Number(data?.id ?? data?.data?.id);
          if (newCid && newCid !== cid) {
            if (typeof window !== "undefined") localStorage.setItem("companyId", newCid.toString());
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
      const publishedJobs = jobsResponse.items.filter((job: any) => job.isPublished).length;
      const totalApplicants = jobsResponse.items.reduce((sum: number, job: any) => sum + (job.applicantsCount || 0), 0);
      const totalInterviews = interviewsResponse.total;

      setRealStats({ totalJobs, publishedJobs, totalApplicants, totalInterviews });
      setRecentJobs(jobsResponse.items.slice(0, 5));
      setUpcomingInterviews(interviewsResponse.items.slice(0, 5));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, realStats, companyInfo, recentJobs, upcomingInterviews, fetchDashboardData } as const;
}


