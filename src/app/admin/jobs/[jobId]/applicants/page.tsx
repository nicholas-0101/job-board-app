"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { listApplicants, updateApplicantStatus, ApplicantItemDTO } from "@/lib/applicants";

export default function ApplicantsPage() {
  const params = useParams<{ jobId: string }>();
  const jobId = Number(params.jobId);
  const [companyId] = useState<number>(() => {
    const raw = localStorage.getItem("companyId");
    return raw ? Number(raw) : 1;
  });

  const [filters, setFilters] = useState({
    name: "",
    education: "",
    ageMin: "",
    ageMax: "",
    expectedSalaryMin: "",
    expectedSalaryMax: "",
    sortBy: "appliedAt" as "appliedAt" | "expectedSalary" | "age",
    sortOrder: "desc" as "asc" | "desc",
  });

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const offset = useMemo(() => (page - 1) * limit, [page, limit]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{ total: number; items: ApplicantItemDTO[] }>({ total: 0, items: [] });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listApplicants({
        companyId,
        jobId,
        name: filters.name || undefined,
        education: filters.education || undefined,
        ageMin: filters.ageMin ? Number(filters.ageMin) : undefined,
        ageMax: filters.ageMax ? Number(filters.ageMax) : undefined,
        expectedSalaryMin: filters.expectedSalaryMin ? Number(filters.expectedSalaryMin) : undefined,
        expectedSalaryMax: filters.expectedSalaryMax ? Number(filters.expectedSalaryMax) : undefined,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        limit,
        offset,
      });
      setData({ total: res.total, items: res.items });
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to load applicants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId, jobId, filters, limit, offset]);

  const onUpdateStatus = async (app: ApplicantItemDTO, status: "IN_REVIEW" | "INTERVIEW" | "ACCEPTED" | "REJECTED") => {
    const label = status === 'REJECTED' ? 'reject' : status === 'ACCEPTED' ? 'accept' : status === 'INTERVIEW' ? 'move to interview' : 'set to in-review';
    if (!confirm(`Are you sure you want to ${label} this applicant?`)) return;
    try {
      await updateApplicantStatus({ companyId, jobId, applicationId: app.id, status });
      fetchData();
    } catch (e: any) {
      alert(e?.response?.data?.message || "Failed to update status");
    }
  };

  const totalPages = Math.max(1, Math.ceil(data.total / limit));

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Applicants</h1>

      <div className="grid gap-3 md:grid-cols-6">
        <input value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} placeholder="Name" className="px-3 py-2 border rounded-lg" />
        <input value={filters.education} onChange={(e) => setFilters({ ...filters, education: e.target.value })} placeholder="Education" className="px-3 py-2 border rounded-lg" />
        <input value={filters.ageMin} onChange={(e) => setFilters({ ...filters, ageMin: e.target.value })} placeholder="Age Min" className="px-3 py-2 border rounded-lg" />
        <input value={filters.ageMax} onChange={(e) => setFilters({ ...filters, ageMax: e.target.value })} placeholder="Age Max" className="px-3 py-2 border rounded-lg" />
        <input value={filters.expectedSalaryMin} onChange={(e) => setFilters({ ...filters, expectedSalaryMin: e.target.value })} placeholder="Salary Min" className="px-3 py-2 border rounded-lg" />
        <input value={filters.expectedSalaryMax} onChange={(e) => setFilters({ ...filters, expectedSalaryMax: e.target.value })} placeholder="Salary Max" className="px-3 py-2 border rounded-lg" />
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <select value={filters.sortBy} onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })} className="px-3 py-2 border rounded-lg">
          <option value="appliedAt">Applied At</option>
          <option value="expectedSalary">Expected Salary</option>
          <option value="age">Age</option>
        </select>
        <select value={filters.sortOrder} onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value as any })} className="px-3 py-2 border rounded-lg">
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
                <th className="text-left p-2 border">Name</th>
                <th className="text-left p-2 border">Education</th>
                <th className="text-left p-2 border">Age</th>
                <th className="text-left p-2 border">Expected Salary</th>
                <th className="text-left p-2 border">Test</th>
                <th className="text-left p-2 border">Status</th>
                <th className="text-left p-2 border">CV</th>
                <th className="text-left p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((a) => (
                <tr key={a.id} className="border-b">
                  <td className="p-2 border">
                    <div className="flex items-center gap-3">
                      <img src={a.profilePicture || "/nobg_logo.png"} alt={a.name} className="w-8 h-8 rounded-full object-cover border" />
                      <div>
                        <div className="font-medium">{a.name}</div>
                        <div className="text-xs text-gray-500">{a.email ?? "-"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-2 border">{a.education ?? "-"}</td>
                  <td className="p-2 border">{a.age ?? "-"}</td>
                  <td className="p-2 border">{a.expectedSalary ?? "-"}</td>
                  <td className="p-2 border">
                    {typeof a.testScore === 'number' ? (
                      <span className={a.testPassed ? 'text-green-600' : 'text-red-600'}>
                        {a.testScore}/25 {a.testPassed ? '(Passed)' : '(Failed)'}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="p-2 border">{a.status}</td>
                  <td className="p-2 border">
                    <a href={a.cvFile} target="_blank" rel="noreferrer" className="text-blue-600 underline">View CV</a>
                  </td>
                  <td className="p-2 border space-x-2">
                    <button onClick={() => onUpdateStatus(a, "IN_REVIEW")} className="px-2 py-1 text-sm border rounded">In Review</button>
                    <button onClick={() => onUpdateStatus(a, "INTERVIEW")} className="px-2 py-1 text-sm border rounded">Interview</button>
                    <button onClick={() => onUpdateStatus(a, "ACCEPTED")} className="px-2 py-1 text-sm border rounded">Accept</button>
                    <button onClick={() => onUpdateStatus(a, "REJECTED")} className="px-2 py-1 text-sm border rounded">Reject</button>
                    <button onClick={() => alert(JSON.stringify(a, null, 2))} className="px-2 py-1 text-sm border rounded">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button disabled={page<=1} onClick={() => setPage((p) => Math.max(1, p-1))} className="px-3 py-2 border rounded">Prev</button>
        <span>Page {page} / {Math.max(1, Math.ceil(data.total / limit))}</span>
        <button disabled={page>=Math.max(1, Math.ceil(data.total / limit))} onClick={() => setPage((p) => Math.min(Math.max(1, Math.ceil(data.total / limit)), p+1))} className="px-3 py-2 border rounded">Next</button>
      </div>
    </div>
  );
}


