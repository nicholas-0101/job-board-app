"use client";
import { useEffect, useMemo, useState } from "react";
import { listCompanyInterviews, createSchedules, updateInterview, deleteInterview, InterviewItemDTO } from "@/lib/interviews";
import { apiCall } from "@/helper/axios";

export default function AdminInterviewsPage() {
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
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState<{ jobId: string; items: Array<{ applicantId: string; scheduleDate: string; locationOrLink?: string; notes?: string }> }>(
    { jobId: "", items: [{ applicantId: "", scheduleDate: "", locationOrLink: "", notes: "" }] }
  );

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
    if (!confirm('Cancel this interview schedule?')) return;
    try {
      await updateInterview({ companyId, id, status: "CANCELLED" });
      fetchData();
    } catch (e: any) {
      alert(e?.response?.data?.message || "Failed to cancel interview");
    }
  };

  const totalPages = Math.max(1, Math.ceil(data.total / limit));

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b bg-gradient-to-r from-primary-50 to-secondary-50">
        <div className="container mx-auto px-4 py-6">
          <div>
            <h1 className="text-2xl font-semibold">Interview Management</h1>
            <p className="text-sm text-muted-foreground mt-1">Schedule and manage interview sessions</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Filters Card */}
        <div className="bg-card rounded-xl shadow-md border p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#467EC7]"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            Filters
          </h3>
          <div className="grid gap-3 md:grid-cols-6">
            <input value={filters.jobId} onChange={(e) => setFilters({ ...filters, jobId: e.target.value })} placeholder="Job ID" className="px-3 py-2 border rounded-xl bg-background hover:border-primary transition-colors" />
            <input value={filters.applicantId} onChange={(e) => setFilters({ ...filters, applicantId: e.target.value })} placeholder="Applicant ID" className="px-3 py-2 border rounded-xl bg-background hover:border-primary transition-colors" />
            <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="px-3 py-2 border rounded-xl bg-background hover:border-primary transition-colors">
              <option value="">Any Status</option>
              {['SCHEDULED','COMPLETED','CANCELLED','NO_SHOW'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <input type="date" value={filters.dateFrom} onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })} className="px-3 py-2 border rounded-xl bg-background hover:border-primary transition-colors" />
            <input type="date" value={filters.dateTo} onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })} className="px-3 py-2 border rounded-xl bg-background hover:border-primary transition-colors" />
            <select value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="px-3 py-2 border rounded-xl bg-background hover:border-primary transition-colors">
              {[5,10,20,50].map((n) => <option key={n} value={n}>{n} per page</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#24CFA7] mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading interviews...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        ) : (
          <>
            {/* Create Schedules Card */}
            <div className="bg-card rounded-xl shadow-md border p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#24CFA7]"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>
                Create Interview Schedules
              </h2>
              <div className="grid gap-3 md:grid-cols-4 mb-4">
                <input value={createForm.jobId} onChange={(e)=>setCreateForm({...createForm, jobId: e.target.value})} placeholder="Job ID" className="px-3 py-2 border rounded-xl bg-background" />
              </div>
              <div className="space-y-3">
                {createForm.items.map((it, idx) => (
                  <div key={idx} className="grid gap-3 md:grid-cols-5 p-4 bg-secondary/30 rounded-xl">
                    <input value={it.applicantId} onChange={(e)=>setCreateForm({...createForm, items: createForm.items.map((x,i)=> i===idx?{...x, applicantId: e.target.value}:x)})} placeholder="Applicant ID" className="px-3 py-2 border rounded-xl bg-background" />
                    <input type="datetime-local" value={it.scheduleDate} onChange={(e)=>setCreateForm({...createForm, items: createForm.items.map((x,i)=> i===idx?{...x, scheduleDate: e.target.value}:x)})} className="px-3 py-2 border rounded-xl bg-background" />
                    <input value={it.locationOrLink} onChange={(e)=>setCreateForm({...createForm, items: createForm.items.map((x,i)=> i===idx?{...x, locationOrLink: e.target.value}:x)})} placeholder="Location/Link" className="px-3 py-2 border rounded-xl bg-background" />
                    <input value={it.notes} onChange={(e)=>setCreateForm({...createForm, items: createForm.items.map((x,i)=> i===idx?{...x, notes: e.target.value}:x)})} placeholder="Notes" className="px-3 py-2 border rounded-xl bg-background" />
                    <button onClick={()=>removeItem(idx)} className="px-3 py-2 border border-red-300 rounded-xl hover:bg-red-50 text-red-600 transition-colors">Remove</button>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={addItem} className="px-4 py-2 border rounded-xl hover:bg-secondary transition-colors flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                  Add Candidate
                </button>
                <button onClick={onCreate} disabled={creating} className="px-6 py-2 bg-[#24CFA7] hover:bg-[#1fc39c] text-white rounded-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  {creating?"Creating...":"Create Schedules"}
                </button>
              </div>
            </div>

            {/* Interviews Table */}
            <div className="bg-card rounded-xl shadow-md border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-primary-50 to-secondary-50">
                    <tr>
                      <th className="text-left p-4 font-semibold text-foreground">Candidate</th>
                      <th className="text-left p-4 font-semibold text-foreground">Job</th>
                      <th className="text-left p-4 font-semibold text-foreground">Schedule</th>
                      <th className="text-left p-4 font-semibold text-foreground">Status</th>
                      <th className="text-left p-4 font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {data.items.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-12 text-center">
                          <div className="flex flex-col items-center gap-4">
                            <div className="p-4 bg-primary-100 rounded-full">
                              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#467EC7]"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>
                            </div>
                            <div>
                              <p className="text-lg font-medium text-foreground mb-1">No interviews scheduled</p>
                              <p className="text-muted-foreground">Create interview schedules using the form above</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      data.items.map((it) => (
                        <tr key={it.id} className="hover:bg-secondary/50 transition-colors">
                          <td className="p-4">
                            <div className="font-medium text-foreground">{it.candidateName}</div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-muted-foreground">{it.jobTitle}</div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2 text-sm">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                              {new Date(it.scheduleDate).toLocaleString()}
                            </div>
                          </td>
                          <td className="p-4">
                            {it.status === 'SCHEDULED' && (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700 font-medium">
                                📅 Scheduled
                              </span>
                            )}
                            {it.status === 'COMPLETED' && (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-700 font-medium">
                                ✓ Completed
                              </span>
                            )}
                            {it.status === 'CANCELLED' && (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-red-100 text-red-700 font-medium">
                                ✕ Cancelled
                              </span>
                            )}
                            {it.status === 'NO_SHOW' && (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700 font-medium">
                                No Show
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            <button onClick={() => onCancel(it.id)} className="px-3 py-1.5 text-sm border border-red-300 rounded-xl hover:bg-red-50 text-red-600 transition-colors">
                              Cancel
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {data.items.length > 0 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button 
              disabled={page<=1} 
              onClick={() => setPage((p) => Math.max(1, p-1))} 
              className="px-4 py-2 border rounded-xl hover:bg-[#467EC7] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              Prev
            </button>
            <div className="px-4 py-2 bg-secondary rounded-xl">
              <span className="font-medium">Page {page}</span>
              <span className="text-muted-foreground"> of {totalPages}</span>
            </div>
            <button 
              disabled={page>=totalPages} 
              onClick={() => setPage((p) => Math.min(totalPages, p+1))} 
              className="px-4 py-2 border rounded-xl hover:bg-[#467EC7] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
            >
              Next
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


