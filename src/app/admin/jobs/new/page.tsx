"use client";
import { useState } from "react";
import { createJob } from "@/lib/jobs";
import { useRouter } from "next/navigation";

export default function NewJobPage() {
  const router = useRouter();
  const [companyId] = useState<number>(() => Number(localStorage.getItem("companyId") || 1));
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    city: "",
    salaryMin: "",
    salaryMax: "",
    tags: "",
    deadline: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createJob({
        companyId,
        title: form.title,
        description: form.description,
        category: form.category,
        city: form.city,
        salaryMin: form.salaryMin ? Number(form.salaryMin) : null,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : null,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        deadline: form.deadline || null,
      });
      router.push("/admin/jobs");
    } catch (e: any) {
      alert(e?.response?.data?.message || "Failed to create job");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Create Job</h1>
      <form onSubmit={onSubmit} className="grid gap-3">
        <input placeholder="Title" value={form.title} onChange={(e)=>setForm({...form, title: e.target.value})} className="px-3 py-2 border rounded" required />
        <textarea placeholder="Description" value={form.description} onChange={(e)=>setForm({...form, description: e.target.value})} className="px-3 py-2 border rounded" rows={6} required />
        <input placeholder="Category" value={form.category} onChange={(e)=>setForm({...form, category: e.target.value})} className="px-3 py-2 border rounded" required />
        <input placeholder="City" value={form.city} onChange={(e)=>setForm({...form, city: e.target.value})} className="px-3 py-2 border rounded" required />
        <div className="grid grid-cols-2 gap-3">
          <input placeholder="Salary Min (optional)" value={form.salaryMin} onChange={(e)=>setForm({...form, salaryMin: e.target.value})} className="px-3 py-2 border rounded" />
          <input placeholder="Salary Max (optional)" value={form.salaryMax} onChange={(e)=>setForm({...form, salaryMax: e.target.value})} className="px-3 py-2 border rounded" />
        </div>
        <input placeholder="Tags (comma separated)" value={form.tags} onChange={(e)=>setForm({...form, tags: e.target.value})} className="px-3 py-2 border rounded" />
        <input type="date" placeholder="Deadline" value={form.deadline} onChange={(e)=>setForm({...form, deadline: e.target.value})} className="px-3 py-2 border rounded" />
        <div className="flex gap-2">
          <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded">{submitting?"Creating...":"Create"}</button>
          <button type="button" onClick={()=>router.back()} className="px-4 py-2 border rounded">Cancel</button>
        </div>
      </form>
    </div>
  );
}


