"use client";
import { useEffect, useState } from "react";
import { updateJob, listCompanyJobs, deleteJob } from "@/lib/jobs";
import { useRouter, useParams } from "next/navigation";

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams<{ jobId: string }>();
  const jobId = Number(params.jobId);
  const [companyId] = useState<number>(() => Number(localStorage.getItem("companyId") || 1));
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await listCompanyJobs({ companyId, limit: 1, offset: 0, title: "" });
        // In absence of a direct detail endpoint on frontend lib, rely on admin jobs table then fetch detail page from backend if available later
        // Keep simple: allow editing fields manually
        setForm((f: any) => ({ ...f }));
      } finally {
        setLoading(false);
      }
    })();
  }, [companyId]);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateJob({ companyId, jobId, ...form });
      router.push("/admin/jobs");
    } catch (e: any) {
      alert(e?.response?.data?.message || "Failed to update job");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!confirm("Delete this job?")) return;
    try {
      await deleteJob({ companyId, jobId });
      router.push("/admin/jobs");
    } catch (e: any) {
      alert(e?.response?.data?.message || "Failed to delete job");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Edit Job</h1>
      <form onSubmit={onSave} className="grid gap-3">
        <input placeholder="Title" defaultValue={form.title} onChange={(e)=>setForm({...form, title: e.target.value})} className="px-3 py-2 border rounded" />
        <textarea placeholder="Description" defaultValue={form.description} onChange={(e)=>setForm({...form, description: e.target.value})} className="px-3 py-2 border rounded" rows={6} />
        <input placeholder="Category" defaultValue={form.category} onChange={(e)=>setForm({...form, category: e.target.value})} className="px-3 py-2 border rounded" />
        <input placeholder="City" defaultValue={form.city} onChange={(e)=>setForm({...form, city: e.target.value})} className="px-3 py-2 border rounded" />
        <div className="grid grid-cols-2 gap-3">
          <input placeholder="Salary Min" defaultValue={form.salaryMin} onChange={(e)=>setForm({...form, salaryMin: Number(e.target.value)||null})} className="px-3 py-2 border rounded" />
          <input placeholder="Salary Max" defaultValue={form.salaryMax} onChange={(e)=>setForm({...form, salaryMax: Number(e.target.value)||null})} className="px-3 py-2 border rounded" />
        </div>
        <input placeholder="Tags (comma separated)" defaultValue={(form.tags||[]).join(', ')} onChange={(e)=>setForm({...form, tags: e.target.value.split(',').map((t:string)=>t.trim()).filter(Boolean)})} className="px-3 py-2 border rounded" />
        <input type="date" placeholder="Deadline" defaultValue={form.deadline} onChange={(e)=>setForm({...form, deadline: e.target.value || null})} className="px-3 py-2 border rounded" />
        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded">{saving?"Saving...":"Save"}</button>
          <button type="button" onClick={onDelete} className="px-4 py-2 border rounded">Delete</button>
        </div>
      </form>
    </div>
  );
}


