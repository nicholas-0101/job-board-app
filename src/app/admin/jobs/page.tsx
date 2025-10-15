"use client";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { listCompanyJobs, togglePublishJob, JobItemDTO } from "@/lib/jobs";
import JobFilters from "./components/JobFilters";
import JobStats from "./components/JobStats";
import { JobsHeader } from "./components/JobsHeader";
import { JobsContent } from "./components/JobsContent";

export default function AdminJobsPage() {
  // NOTE: Replace with actual admin's companyId from profile
  const [companyId, setCompanyId] = useState<number>(() => {
    const raw = localStorage.getItem("companyId");
    return raw ? Number(raw) : NaN;
  });

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState<"createdAt" | "deadline">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const offset = useMemo(() => (page - 1) * limit, [page, limit]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{ total: number; items: JobItemDTO[] }>({
    total: 0,
    items: [],
  });
  const [openRowId, setOpenRowId] = useState<number | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Always resolve companyId from backend to avoid stale localStorage
      const token = localStorage.getItem("token");
      let resolvedId = companyId;
      try {
        // Prefer axios instance (baseURL + auth interceptor)
        const resp = await (
          await import("@/helper/axios")
        ).apiCall.get("/company/admin");
        const data = resp.data?.data ?? resp.data;
        const backendId = Number(data?.id ?? data?.data?.id);
        if (backendId) {
          resolvedId = backendId;
          if (backendId !== companyId) {
            localStorage.setItem("companyId", backendId.toString());
            setCompanyId(backendId);
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
      // Fallback: if backend reports 404 due to stale id, refresh id and retry once
      try {
        const resp = await (
          await import("@/helper/axios")
        ).apiCall.get("/company/admin");
        const data = resp.data?.data ?? resp.data;
        const backendId = Number(data?.id ?? data?.data?.id);
        if (backendId) {
          localStorage.setItem("companyId", backendId.toString());
          setCompanyId(backendId);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId, title, category, sortBy, sortOrder, limit, offset]);

  const onTogglePublish = async (jobId: number, isPublished: boolean) => {
    const next = isPublished ? "unpublish" : "publish";
    if (!confirm(`Are you sure you want to ${next} this job?`)) return;
    try {
      await togglePublishJob({
        companyId,
        jobId,
        isPublished: !isPublished,
      });
      fetchData();
    } catch (e: any) {
      alert(e?.response?.data?.message || "Failed to update publish status");
    }
  };

  const totalPages = Math.max(1, Math.ceil(data.total / limit));

  return (
    <div className="min-h-screen">
      {/* Header */}
      <JobsHeader loading={loading} onRefresh={fetchData} />

      <div className="container mx-auto px-4 py-6 space-y-6">
        <JobStats jobs={data.items} />
        
        <JobFilters
          title={title}
          setTitle={setTitle}
          category={category}
          setCategory={setCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          onApplyFilters={fetchData}
        />

        {error ? (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6 text-center">
              <p className="text-red-600 font-medium">{error}</p>
            </CardContent>
          </Card>
        ) : (
          <JobsContent
            jobs={data.items}
            loading={loading}
            total={data.total}
            page={page}
            limit={limit}
            onPageChange={setPage}
            onTogglePublish={onTogglePublish}
          />
        )}
      </div>
    </div>
  );
}
