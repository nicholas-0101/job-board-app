"use client";
import { useEffect, useMemo, useState } from "react";
import { listCompanyJobs, togglePublishJob, JobItemDTO } from "@/lib/jobs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  const [data, setData] = useState<{ total: number; items: JobItemDTO[] }>({ total: 0, items: [] });
  const [openRowId, setOpenRowId] = useState<number | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Always resolve companyId from backend to avoid stale localStorage
      const token = localStorage.getItem("token");
      let resolvedId = companyId;
      try {
        const resp = await fetch("http://localhost:4400/company/admin", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resp.ok) {
          const data = await resp.json();
          const backendId = Number(data?.id ?? data?.data?.id);
          if (backendId) {
            resolvedId = backendId;
            if (backendId !== companyId) {
              localStorage.setItem("companyId", backendId.toString());
              setCompanyId(backendId);
            }
          }
        }
      } catch {}

      if (!resolvedId || Number.isNaN(resolvedId)) throw new Error("Company not found");

      console.log("Fetching jobs with params:", { companyId: resolvedId, title, category, sortBy, sortOrder, limit, offset });
      let res = await listCompanyJobs({ companyId: resolvedId, title, category, sortBy, sortOrder, limit, offset });
      console.log("Jobs response:", res);
      setData({ total: res.total, items: res.items });
    } catch (e: any) {
      // Fallback: if backend reports 404 due to stale id, refresh id and retry once
      try {
        const token = localStorage.getItem("token");
        const resp = await fetch("http://localhost:4400/company/admin", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resp.ok) {
          const data = await resp.json();
          const backendId = Number(data?.id ?? data?.data?.id);
          if (backendId) {
            localStorage.setItem("companyId", backendId.toString());
            setCompanyId(backendId);
            const res = await listCompanyJobs({ companyId: backendId, title, category, sortBy, sortOrder, limit, offset });
            setData({ total: res.total, items: res.items });
            setError(null);
            return;
          }
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

  const onTogglePublish = async (job: JobItemDTO) => {
    const next = job.isPublished ? 'unpublish' : 'publish';
    if (!confirm(`Are you sure you want to ${next} "${job.title}"?`)) return;
    try {
      await togglePublishJob({ companyId, jobId: job.id, isPublished: !job.isPublished });
      fetchData();
    } catch (e: any) {
      alert(e?.response?.data?.message || "Failed to update publish status");
    }
  };

  const totalPages = Math.max(1, Math.ceil(data.total / limit));

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-semibold">Company Jobs</h1>
        <Link href="/admin/jobs/new">
          <Button className="bg-[#24CFA7] hover:bg-[#1fc39c]">New Job</Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-5">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
            <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="px-3 py-2 border rounded-md bg-background">
              <option value="createdAt">Created</option>
              <option value="deadline">Deadline</option>
            </select>
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as any)} className="px-3 py-2 border rounded-md bg-background">
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
            <select value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="px-3 py-2 border rounded-md bg-background">
              {[5,10,20,50].map((n) => <option key={n} value={n}>{n} / page</option>)}
            </select>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-destructive">{error}</div>
      ) : (
        <>
          {/* Card list on small screens */}
          <div className="grid gap-3 md:hidden">
            {data.items.map((j) => (
              <Card key={j.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-semibold truncate">{j.title}</h3>
                      <div className="text-sm text-muted-foreground flex flex-wrap gap-2 mt-1">
                        <span className="truncate">{j.category}</span>
                        <span className="truncate">• {j.city}</span>
                        <span>• {j.applicantsCount} applicants</span>
                        <span>• {j.isPublished ? "Published" : "Draft"}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0 flex-wrap">
                      <Button size="sm" onClick={() => onTogglePublish(j)} className="bg-[#467EC7] hover:bg-[#578BCC] whitespace-nowrap">
                        {j.isPublished ? "Unpublish" : "Publish"}
                      </Button>
                      <Link href={`/admin/jobs/${j.id}/edit`}>
                        <Button size="sm" className="bg-[#24CFA7] hover:bg-[#1fc39c] whitespace-nowrap">Edit</Button>
                      </Link>
                      <Link href={`/admin/jobs/${j.id}/applicants`}>
                        <Button size="sm" variant="outline" className="whitespace-nowrap">Applicants ({j.applicantsCount})</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Table on md and above */}
          <Card className="hidden md:block">
            <CardContent className="pt-6 overflow-auto">
              <table className="w-full border rounded-md table-fixed">
                <thead className="bg-accent text-sm">
                  <tr>
                    <th className="text-left p-2 border w-[28%]">Title</th>
                    <th className="text-left p-2 border w-[18%]">Category</th>
                    <th className="text-left p-2 border w-[18%]">City</th>
                    <th className="text-left p-2 border w-[14%]">Applicants</th>
                    <th className="text-left p-2 border w-[12%]">Published</th>
                    <th className="text-left p-2 border w-[10%]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((j) => (
                    <tr key={j.id} className="border-b">
                      <td className="p-2 border truncate">{j.title}</td>
                      <td className="p-2 border truncate">{j.category}</td>
                      <td className="p-2 border truncate">{j.city}</td>
                      <td className="p-2 border">{j.applicantsCount}</td>
                      <td className="p-2 border">{j.isPublished ? "Yes" : "No"}</td>
                      <td className="p-2 border">
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-[#467EC7] hover:bg-[#578BCC]" onClick={() => onTogglePublish(j)}>
                            {j.isPublished ? "Unpublish" : "Publish"}
                          </Button>
                          <Link href={`/admin/jobs/${j.id}/edit`}>
                            <Button size="sm" className="bg-[#24CFA7] hover:bg-[#1fc39c]">Edit</Button>
                          </Link>
                          <Link href={`/admin/jobs/${j.id}/applicants`}>
                            <Button size="sm" variant="outline">Applicants</Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </>
      )}

      <div className="flex items-center gap-2">
        <Button variant="outline" disabled={page<=1} onClick={() => setPage((p) => Math.max(1, p-1))}>Prev</Button>
        <span>Page {page} / {totalPages}</span>
        <Button variant="outline" disabled={page>=totalPages} onClick={() => setPage((p) => Math.min(totalPages, p+1))}>Next</Button>
      </div>
    </div>
  );
}


