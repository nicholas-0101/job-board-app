"use client";
import { useMemo, useState } from "react";
import { createSchedules, updateInterview, InterviewItemDTO } from "@/lib/interviews";
import { InterviewFilters } from "./components/InterviewFilters";
import { CreateInterviewForm } from "./components/CreateInterviewForm";
import { InterviewsTable } from "./components/InterviewsTable";
import { EditInterviewModal } from "./components/EditInterviewModal";
import { useInterviewData } from "./hooks/useInterviewData";

export default function AdminInterviewsPage() {
  const [filters, setFilters] = useState({ jobId: "", applicantId: "", status: "", dateFrom: "", dateTo: "" });
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const offset = useMemo(() => (page - 1) * limit, [page, limit]);
  const { companyId, loading, error, data, jobsList, eligibleApplicants, loadingJobs, loadingApplicants, setSelectedJobId, fetchData } = useInterviewData(filters, limit, offset);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState<{ jobId: string; items: Array<{ applicantId: string; scheduleDate: string; locationOrLink?: string; notes?: string }> }>(
    { jobId: "", items: [{ applicantId: "", scheduleDate: "", locationOrLink: "", notes: "" }] }
  );
  const [editingInterview, setEditingInterview] = useState<InterviewItemDTO | null>(null);
  const [editForm, setEditForm] = useState({ scheduleDate: "", locationOrLink: "", notes: "", status: "SCHEDULED" as "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW" });
  const [updating, setUpdating] = useState(false);
  const addItem = () => setCreateForm((f) => ({ ...f, items: [...f.items, { applicantId: "", scheduleDate: "", locationOrLink: "", notes: "" }] }));
  const removeItem = (idx: number) => setCreateForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));
  const handleJobChange = (jobId: string) => {
    setSelectedJobId(jobId);
    setCreateForm((f) => ({ ...f, jobId, items: [{ applicantId: "", scheduleDate: "", locationOrLink: "", notes: "" }] }));
  };
  const onEdit = (interview: InterviewItemDTO) => {
    setEditingInterview(interview);
    const dateStr = new Date(interview.scheduleDate).toISOString().slice(0, 16);
    setEditForm({ scheduleDate: dateStr, locationOrLink: interview.locationOrLink || "", notes: interview.notes || "", status: interview.status });
  };
  const onSaveEdit = async () => {
    if (!editingInterview) return;
    setUpdating(true);
    try {
      await updateInterview({ companyId, id: editingInterview.id, scheduleDate: editForm.scheduleDate, locationOrLink: editForm.locationOrLink || null, notes: editForm.notes || null, status: editForm.status });
      setEditingInterview(null);
      fetchData();
    } catch (e: any) {
      alert(e?.response?.data?.message || "Failed to update interview");
    } finally {
      setUpdating(false);
    }
  };
  const onCloseModal = () => {
    setEditingInterview(null);
    setEditForm({ scheduleDate: "", locationOrLink: "", notes: "", status: "SCHEDULED" });
  };
  const onCreate = async () => {
    setCreating(true);
    try {
      await createSchedules({ companyId, jobId: Number(createForm.jobId), items: createForm.items.map((it) => ({ applicantId: Number(it.applicantId), scheduleDate: it.scheduleDate, locationOrLink: it.locationOrLink || null, notes: it.notes || null })) });
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
      <div className="border-b bg-gradient-to-r from-primary-50 to-secondary-50">
        <div className="container mx-auto px-4 py-6">
          <div>
            <h1 className="text-2xl font-semibold">Interview Management</h1>
            <p className="text-sm text-muted-foreground mt-1">Schedule and manage interview sessions</p>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-6 space-y-6">
        <InterviewFilters filters={filters} limit={limit} onFiltersChange={setFilters} onLimitChange={setLimit} />
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
            <CreateInterviewForm createForm={createForm} jobsList={jobsList} eligibleApplicants={eligibleApplicants} loadingJobs={loadingJobs} loadingApplicants={loadingApplicants} creating={creating} onJobChange={handleJobChange} onFormChange={setCreateForm} onAddItem={addItem} onRemoveItem={removeItem} onCreate={onCreate} />
            <InterviewsTable items={data.items} onEdit={onEdit} onCancel={onCancel} />
          </>
        )}
        {data.items.length > 0 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button disabled={page<=1} onClick={() => setPage((p) => Math.max(1, p-1))} className="px-4 py-2 border rounded-xl hover:bg-[#467EC7] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              Prev
            </button>
            <div className="px-4 py-2 bg-secondary rounded-xl">
              <span className="font-medium">Page {page}</span>
              <span className="text-muted-foreground"> of {totalPages}</span>
            </div>
            <button disabled={page>=totalPages} onClick={() => setPage((p) => Math.min(totalPages, p+1))} className="px-4 py-2 border rounded-xl hover:bg-[#467EC7] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1">
              Next
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        )}
        <EditInterviewModal interview={editingInterview} editForm={editForm} updating={updating} onFormChange={setEditForm} onSave={onSaveEdit} onClose={onCloseModal} />
      </div>
    </div>
  );
}
