import { useEffect, useState } from "react";
import { listCompanyInterviews, getJobsWithApplicantCounts, getEligibleApplicants, InterviewItemDTO, JobWithApplicantCountDTO, EligibleApplicantDTO } from "@/lib/interviews";
import { apiCall } from "@/helper/axios";

export function useInterviewData(filters: any, limit: number, offset: number) {
  const [companyId, setCompanyId] = useState<number>(() => {
    const raw = localStorage.getItem("companyId");
    return raw ? Number(raw) : NaN;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{ total: number; items: InterviewItemDTO[] }>({ total: 0, items: [] });
  const [jobsList, setJobsList] = useState<JobWithApplicantCountDTO[]>([]);
  const [eligibleApplicants, setEligibleApplicants] = useState<EligibleApplicantDTO[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState("");
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      let cid = companyId;
      if (!cid || Number.isNaN(cid)) {
        try {
          const resp = await apiCall.get("/company/admin");
          const respData = resp.data?.data ?? resp.data;
          const resolved = Number(respData?.id ?? respData?.data?.id);
          if (resolved) {
            cid = resolved;
            localStorage.setItem("companyId", cid.toString());
            setCompanyId(cid);
          }
        } catch {}
      }
      if (!cid || Number.isNaN(cid)) throw new Error("Company not found");
      const res = await listCompanyInterviews({
        companyId: cid,
        jobId: filters.jobId ? Number(filters.jobId) : undefined,
        applicantId: filters.applicantId ? Number(filters.applicantId) : undefined,
        status: (filters.status || undefined) as any,
        dateFrom: filters.dateFrom || undefined,
        dateTo: filters.dateTo || undefined,
        limit,
        offset,
      });
      setData({ total: res.total, items: res.items });
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to load interviews");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [companyId, filters, limit, offset]);
  useEffect(() => {
    const fetchJobs = async () => {
      if (!companyId || Number.isNaN(companyId)) return;
      setLoadingJobs(true);
      try {
        const jobs = await getJobsWithApplicantCounts(companyId);
        setJobsList(jobs);
      } catch (e: any) {
        console.error("Failed to load jobs:", e);
      } finally {
        setLoadingJobs(false);
      }
    };
    fetchJobs();
  }, [companyId]);
  useEffect(() => {
    const fetchApplicants = async () => {
      if (!companyId || Number.isNaN(companyId) || !selectedJobId) {
        setEligibleApplicants([]);
        return;
      }
      setLoadingApplicants(true);
      try {
        const applicants = await getEligibleApplicants(companyId, Number(selectedJobId));
        setEligibleApplicants(applicants);
      } catch (e: any) {
        console.error("Failed to load applicants:", e);
        setEligibleApplicants([]);
      } finally {
        setLoadingApplicants(false);
      }
    };
    fetchApplicants();
  }, [companyId, selectedJobId]);
  return {
    companyId, loading, error, data, jobsList, eligibleApplicants,
    loadingJobs, loadingApplicants, setSelectedJobId, fetchData
  };
}

