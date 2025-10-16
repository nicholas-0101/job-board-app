import { useState, useEffect, useMemo } from "react";
import { listCompanyJobs, togglePublishJob, JobItemDTO } from "@/lib/jobs";
import { useCompanyId } from "@/hooks/useCompanyId";

interface UseJobsDataProps {
  title: string;
  category: string;
  sortBy: "createdAt" | "deadline";
  sortOrder: "asc" | "desc";
  limit: number;
  page: number;
}

export function useJobsData({
  title,
  category,
  sortBy,
  sortOrder,
  limit,
  page,
}: UseJobsDataProps) {
  const { companyId, fetchCompanyId } = useCompanyId();
  const offset = useMemo(() => (page - 1) * limit, [page, limit]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{ total: number; items: JobItemDTO[] }>({
    total: 0,
    items: [],
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      let resolvedId = companyId;
      try {
        const resp = await (
          await import("@/helper/axios")
        ).apiCall.get("/company/admin");
        const data = resp.data?.data ?? resp.data;
        const backendId = Number(data?.id ?? data?.data?.id);
        if (backendId) {
          resolvedId = backendId;
          if (backendId !== companyId) {
            localStorage.setItem("companyId", backendId.toString());
          }
        }
      } catch {}

      if (!resolvedId || Number.isNaN(resolvedId))
        throw new Error("Company not found");

      let res = await listCompanyJobs({
        companyId: resolvedId,
        title,
        category,
        sortBy,
        sortOrder,
        limit,
        offset,
      });
      setData({ total: res.total, items: res.items });
    } catch (e: any) {
      try {
        const resp = await (
          await import("@/helper/axios")
        ).apiCall.get("/company/admin");
        const data = resp.data?.data ?? resp.data;
        const backendId = Number(data?.id ?? data?.data?.id);
        if (backendId) {
          localStorage.setItem("companyId", backendId.toString());
          const res = await listCompanyJobs({
            companyId: backendId,
            title,
            category,
            sortBy,
            sortOrder,
            limit,
            offset,
          });
          setData({ total: res.total, items: res.items });
          setError(null);
          return;
        }
        throw e;
      } catch (err: any) {
        console.error("Error fetching jobs:", err);
        setError(err?.response?.data?.message || "Failed to load jobs");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [companyId, title, category, sortBy, sortOrder, limit, offset]);

  const handleTogglePublish = async (job: JobItemDTO) => {
    const next = job.isPublished ? "unpublish" : "publish";
    if (!confirm(`Are you sure you want to ${next} "${job.title}"?`)) return;
    try {
      await togglePublishJob({
        companyId,
        jobId: job.id,
        isPublished: !job.isPublished,
      });
      fetchData();
    } catch (e: any) {
      alert(e?.response?.data?.message || "Failed to update publish status");
    }
  };

  return {
    data,
    loading,
    error,
    fetchData,
    handleTogglePublish,
  };
}
