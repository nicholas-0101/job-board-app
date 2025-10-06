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
        // Prefer axios instance (baseURL + auth interceptor)
        const resp = await (await import("@/helper/axios")).apiCall.get("/company/admin");
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

      if (!resolvedId || Number.isNaN(resolvedId)) throw new Error("Company not found");

      console.log("Fetching jobs with params:", { companyId: resolvedId, title, category, sortBy, sortOrder, limit, offset });
      let res = await listCompanyJobs({ companyId: resolvedId, title, category, sortBy, sortOrder, limit, offset });
      console.log("Jobs response:", res);
      setData({ total: res.total, items: res.items });
    } catch (e: any) {
      // Fallback: if backend reports 404 due to stale id, refresh id and retry once
      try {
        const resp = await (await import("@/helper/axios")).apiCall.get("/company/admin");
        const data = resp.data?.data ?? resp.data;
        const backendId = Number(data?.id ?? data?.data?.id);
        if (backendId) {
          localStorage.setItem("companyId", backendId.toString());
          setCompanyId(backendId);
          const res = await listCompanyJobs({ companyId: backendId, title, category, sortBy, sortOrder, limit, offset });
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
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b bg-gradient-to-r from-primary-50 to-secondary-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold">Company Jobs</h1>
              <p className="text-sm text-muted-foreground mt-1">Manage your job postings</p>
            </div>
            <Link href="/admin/jobs/new">
              <Button className="bg-[#24CFA7] hover:bg-[#1fc39c] gap-2 shadow-md hover:shadow-lg transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                New Job
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#467EC7]"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-5">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Search by title..." className="rounded-xl" />
              <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category..." className="rounded-xl" />
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="px-3 py-2 border rounded-xl bg-background hover:border-primary transition-colors">
                <option value="createdAt">Sort: Created</option>
                <option value="deadline">Sort: Deadline</option>
              </select>
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as any)} className="px-3 py-2 border rounded-xl bg-background hover:border-primary transition-colors">
                <option value="desc">Order: Desc</option>
                <option value="asc">Order: Asc</option>
              </select>
              <select value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="px-3 py-2 border rounded-xl bg-background hover:border-primary transition-colors">
                {[5,10,20,50].map((n) => <option key={n} value={n}>{n} per page</option>)}
              </select>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#24CFA7] mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading jobs...</p>
            </div>
          </div>
        ) : error ? (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6 text-center">
              <p className="text-red-600 font-medium">{error}</p>
            </CardContent>
          </Card>
        ) : (
        <>
          {data.items.length === 0 && (
            <Card className="border-dashed shadow-md">
              <CardContent className="p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-primary-100 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#467EC7]"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                  </div>
                  <div>
                    <p className="text-lg font-medium text-foreground mb-1">No jobs yet</p>
                    <p className="text-muted-foreground">Create your first job posting to start attracting candidates</p>
                  </div>
                  <Link href="/admin/jobs/new">
                    <Button className="bg-[#24CFA7] hover:bg-[#1fc39c] mt-2">Create First Job</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
          {/* Card list on small screens */}
          <div className="grid gap-4 md:hidden">
            {data.items.map((j) => (
              <Card key={j.id} className="hover:shadow-lg transition-all duration-300 border-l-4" style={{ borderLeftColor: j.isPublished ? '#24CFA7' : '#94a3b8' }}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-lg truncate mb-2">{j.title}</h3>
                      <div className="flex flex-wrap gap-2 text-sm">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
                          {j.category}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                          {j.city}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-purple-100 text-purple-700">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                          {j.applicantsCount} applicants
                        </span>
                        {j.isPublished ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                            ✓ Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-700 font-medium">
                            Draft
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap mt-4">
                    <Button size="sm" onClick={() => onTogglePublish(j)} className="bg-[#467EC7] hover:bg-[#578BCC] whitespace-nowrap shadow-md">
                      {j.isPublished ? "Unpublish" : "Publish"}
                    </Button>
                    <Link href={`/admin/jobs/${j.id}/edit`}>
                      <Button size="sm" className="bg-[#24CFA7] hover:bg-[#1fc39c] whitespace-nowrap shadow-md">Edit</Button>
                    </Link>
                    <Link href={`/admin/jobs/${j.id}/applicants`}>
                      <Button size="sm" variant="outline" className="whitespace-nowrap hover:bg-secondary">Applicants ({j.applicantsCount})</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Table on md and above */}
          <Card className="hidden md:block shadow-md overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-primary-50 to-secondary-50">
                    <tr>
                      <th className="text-left p-4 font-semibold text-foreground">Title</th>
                      <th className="text-left p-4 font-semibold text-foreground">Category</th>
                      <th className="text-left p-4 font-semibold text-foreground">City</th>
                      <th className="text-left p-4 font-semibold text-foreground">Applicants</th>
                      <th className="text-left p-4 font-semibold text-foreground">Status</th>
                      <th className="text-left p-4 font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {data.items.map((j) => (
                      <tr key={j.id} className="hover:bg-secondary/50 transition-colors">
                        <td className="p-4">
                          <div className="font-medium text-foreground">{j.title}</div>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-blue-100 text-blue-700 font-medium">
                            {j.category}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="flex items-center text-sm text-muted-foreground">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                            {j.city}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-purple-100 text-purple-700 font-medium">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                            {j.applicantsCount}
                          </span>
                        </td>
                        <td className="p-4">
                          {j.isPublished ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-700 font-medium">
                              ✓ Published
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700 font-medium">
                              Draft
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-[#467EC7] hover:bg-[#578BCC] shadow-sm" onClick={() => onTogglePublish(j)}>
                              {j.isPublished ? "Unpublish" : "Publish"}
                            </Button>
                            <Link href={`/admin/jobs/${j.id}/edit`}>
                              <Button size="sm" className="bg-[#24CFA7] hover:bg-[#1fc39c] shadow-sm">Edit</Button>
                            </Link>
                            <Link href={`/admin/jobs/${j.id}/applicants`}>
                              <Button size="sm" variant="outline" className="hover:bg-secondary">Applicants</Button>
                            </Link>
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

        {data.items.length > 0 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <Button 
              variant="outline" 
              disabled={page<=1} 
              onClick={() => setPage((p) => Math.max(1, p-1))}
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
              disabled={page>=totalPages} 
              onClick={() => setPage((p) => Math.min(totalPages, p+1))}
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


