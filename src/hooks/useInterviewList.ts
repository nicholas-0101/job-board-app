import { useState, useEffect, useMemo } from "react";
import { listCompanyInterviews, InterviewItemDTO } from "@/lib/interviews";
import { apiCall } from "@/helper/axios";

export function useInterviewList() {
  const [companyId, setCompanyId] = useState<number>(() => {
    const raw = localStorage.getItem("companyId");
    return raw ? Number(raw) : NaN;
  });

  const [filters, setFilters] = useState({
    jobId: "",
    applicantId: "",
    status: "",
    dateFrom: "",
    dateTo: "",
  });
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const offset = useMemo(() => (page - 1) * limit, [page, limit]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{ total: number; items: InterviewItemDTO[] }>({ total: 0, items: [] });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Resolve companyId from backend if missing
      let cid = companyId;
      if (!cid || Number.isNaN(cid)) {
        try {
          const resp = await apiCall.get("/company/admin");
          const data = resp.data?.data ?? resp.data;
          const resolved = Number(data?.id ?? data?.data?.id);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId, filters, limit, offset]);

  const totalPages = Math.max(1, Math.ceil(data.total / limit));

  return {
    companyId,
    filters,
    setFilters,
    limit,
    setLimit,
    page,
    setPage,
    loading,
    error,
    data,
    totalPages,
    refetch: fetchData,
  };
}
