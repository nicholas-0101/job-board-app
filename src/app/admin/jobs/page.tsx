"use client";
import { useEffect, useMemo, useState } from "react";
import { listCompanyJobs, togglePublishJob, JobItemDTO } from "@/lib/jobs";
import Link from "next/link";

export default function AdminJobsPage() {
  // NOTE: Replace with actual admin's companyId from profile
  const [companyId, setCompanyId] = useState<number>(() => {
    const raw = localStorage.getItem("companyId");
    return raw ? Number(raw) : 1;
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

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listCompanyJobs({ companyId, title, category, sortBy, sortOrder, limit, offset });
      setData({ total: res.total, items: res.items });
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId, title, category, sortBy, sortOrder, limit, offset]);

  const onTogglePublish = async (job: JobItemDTO) => {
    try {
      await togglePublishJob({ companyId, jobId: job.id, isPublished: !job.isPublished });
      fetchData();
    } catch (e: any) {
      alert(e?.response?.data?.message || "Failed to update publish status");
    }
  };

  const totalPages = Math.max(1, Math.ceil(data.total / limit));

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Company Jobs</h1>

      <div>
        <Link href="/admin/jobs/new" className="inline-block px-4 py-2 bg-blue-600 text-white rounded">New Job</Link>
      </div>

      <div className="grid gap-3 md:grid-cols-5">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="px-3 py-2 border rounded-lg" />
        <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" className="px-3 py-2 border rounded-lg" />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="px-3 py-2 border rounded-lg">
          <option value="createdAt">Created</option>
          <option value="deadline">Deadline</option>
        </select>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as any)} className="px-3 py-2 border rounded-lg">
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
        <select value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="px-3 py-2 border rounded-lg">
          {[5,10,20,50].map((n) => <option key={n} value={n}>{n} / page</option>)}
        </select>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-2 border">Title</th>
                <th className="text-left p-2 border">Category</th>
                <th className="text-left p-2 border">City</th>
                <th className="text-left p-2 border">Applicants</th>
                <th className="text-left p-2 border">Published</th>
                <th className="text-left p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((j) => (
                <tr key={j.id} className="border-b">
                  <td className="p-2 border">{j.title}</td>
                  <td className="p-2 border">{j.category}</td>
                  <td className="p-2 border">{j.city}</td>
                  <td className="p-2 border">{j.applicantsCount}</td>
                  <td className="p-2 border">{j.isPublished ? "Yes" : "No"}</td>
                  <td className="p-2 border">
                    <button onClick={() => onTogglePublish(j)} className="px-3 py-1 text-sm rounded bg-blue-600 text-white">
                      {j.isPublished ? "Unpublish" : "Publish"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button disabled={page<=1} onClick={() => setPage((p) => Math.max(1, p-1))} className="px-3 py-2 border rounded">Prev</button>
        <span>Page {page} / {totalPages}</span>
        <button disabled={page>=totalPages} onClick={() => setPage((p) => Math.min(totalPages, p+1))} className="px-3 py-2 border rounded">Next</button>
      </div>
    </div>
  );
}


