"use client";
import { useEffect, useMemo, useState } from "react";
import { listCompanyInterviews, createSchedules, updateInterview, deleteInterview, InterviewItemDTO } from "@/lib/interviews";

export default function AdminInterviewsPage() {
  const [companyId, setCompanyId] = useState<number>(() => {
    const raw = localStorage.getItem("companyId");
    return raw ? Number(raw) : 16; // Default to company ID 16 from our script
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
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState<{ jobId: string; items: Array<{ applicantId: string; scheduleDate: string; locationOrLink?: string; notes?: string }> }>(
    { jobId: "", items: [{ applicantId: "", scheduleDate: "", locationOrLink: "", notes: "" }] }
  );

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listCompanyInterviews({
        companyId,
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

  const addItem = () => setCreateForm((f) => ({ ...f, items: [...f.items, { applicantId: "", scheduleDate: "", locationOrLink: "", notes: "" }] }));
  const removeItem = (idx: number) => setCreateForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));
  const onCreate = async () => {
    setCreating(true);
    try {
      await createSchedules({
        companyId,
        jobId: Number(createForm.jobId),
        items: createForm.items.map((it) => ({
          applicantId: Number(it.applicantId),
          scheduleDate: it.scheduleDate,
          locationOrLink: it.locationOrLink || null,
          notes: it.notes || null,
        })),
      });
      setCreateForm({ jobId: "", items: [{ applicantId: "", scheduleDate: "", locationOrLink: "", notes: "" }] });
      fetchData();
    } catch (e: any) {
      alert(e?.response?.data?.message || "Failed to create schedules");
    } finally {
      setCreating(false);
    }
  };

  const onCancel = async (id: number) => {
    try {
      await updateInterview({ companyId, id, status: "CANCELLED" });
      fetchData();
    } catch (e: any) {
      alert(e?.response?.data?.message || "Failed to cancel interview");
    }
  };

  const totalPages = Math.max(1, Math.ceil(data.total / limit));

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Interviews</h1>

      <div className="grid gap-3 md:grid-cols-6">
        <input value={filters.jobId} onChange={(e) => setFilters({ ...filters, jobId: e.target.value })} placeholder="Job ID" className="px-3 py-2 border rounded-lg" />
        <input value={filters.applicantId} onChange={(e) => setFilters({ ...filters, applicantId: e.target.value })} placeholder="Applicant ID" className="px-3 py-2 border rounded-lg" />
        <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="px-3 py-2 border rounded-lg">
          <option value="">Any Status</option>
          {['SCHEDULED','COMPLETED','CANCELLED','NO_SHOW'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <input type="date" value={filters.dateFrom} onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })} className="px-3 py-2 border rounded-lg" />
        <input type="date" value={filters.dateTo} onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })} className="px-3 py-2 border rounded-lg" />
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
          <div className="mb-4 p-4 border rounded">
            <h2 className="font-semibold mb-2">Create Schedules</h2>
            <div className="grid gap-2 md:grid-cols-4 mb-2">
              <input value={createForm.jobId} onChange={(e)=>setCreateForm({...createForm, jobId: e.target.value})} placeholder="Job ID" className="px-3 py-2 border rounded" />
            </div>
            {createForm.items.map((it, idx) => (
              <div key={idx} className="grid gap-2 md:grid-cols-5 mb-2">
                <input value={it.applicantId} onChange={(e)=>setCreateForm({...createForm, items: createForm.items.map((x,i)=> i===idx?{...x, applicantId: e.target.value}:x)})} placeholder="Applicant ID" className="px-3 py-2 border rounded" />
                <input type="datetime-local" value={it.scheduleDate} onChange={(e)=>setCreateForm({...createForm, items: createForm.items.map((x,i)=> i===idx?{...x, scheduleDate: e.target.value}:x)})} className="px-3 py-2 border rounded" />
                <input value={it.locationOrLink} onChange={(e)=>setCreateForm({...createForm, items: createForm.items.map((x,i)=> i===idx?{...x, locationOrLink: e.target.value}:x)})} placeholder="Location/Link" className="px-3 py-2 border rounded" />
                <input value={it.notes} onChange={(e)=>setCreateForm({...createForm, items: createForm.items.map((x,i)=> i===idx?{...x, notes: e.target.value}:x)})} placeholder="Notes" className="px-3 py-2 border rounded" />
                <button onClick={()=>removeItem(idx)} className="px-3 py-2 border rounded">Remove</button>
              </div>
            ))}
            <div className="flex gap-2">
              <button onClick={addItem} className="px-4 py-2 border rounded">Add Row</button>
              <button onClick={onCreate} disabled={creating} className="px-4 py-2 bg-blue-600 text-white rounded">{creating?"Creating...":"Create"}</button>
            </div>
          </div>
          <table className="w-full border">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-2 border">Candidate</th>
                <th className="text-left p-2 border">Job</th>
                <th className="text-left p-2 border">Schedule</th>
                <th className="text-left p-2 border">Status</th>
                <th className="text-left p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((it) => (
                <tr key={it.id} className="border-b">
                  <td className="p-2 border">{it.candidateName}</td>
                  <td className="p-2 border">{it.jobTitle}</td>
                  <td className="p-2 border">{new Date(it.scheduleDate).toLocaleString()}</td>
                  <td className="p-2 border">{it.status}</td>
                  <td className="p-2 border space-x-2">
                    <button onClick={() => onCancel(it.id)} className="px-2 py-1 text-sm border rounded">Cancel</button>
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


