"use client";

import { useInterviewList } from "@/hooks/useInterviewList";
import { useInterviewForm } from "@/hooks/useInterviewForm";
import { useInterviewEdit } from "@/hooks/useInterviewEdit";
import CreateInterviewForm from "@/components/admin/interviews/CreateInterviewForm";
import InterviewsTable from "@/components/admin/interviews/InterviewsTable";
import InterviewPagination from "@/components/admin/interviews/InterviewPagination";
import EditInterviewModal from "@/components/admin/interviews/EditInterviewModal";

export default function AdminInterviewsPage() {
  const {
    companyId,
    limit,
    setLimit,
    page,
    setPage,
    loading,
    error,
    data,
    totalPages,
    refetch,
  } = useInterviewList();

  const {
    createForm,
    creating,
    jobsList,
    eligibleApplicants,
    loadingJobs,
    loadingApplicants,
    addItem,
    removeItem,
    handleJobChange,
    handleItemChange,
    handleCreate,
  } = useInterviewForm(companyId);

  const {
    editingInterview,
    editForm,
    updating,
    onEdit,
    onSaveEdit,
    onCloseModal,
    onFormChange,
    onCancel,
    onComplete,
    onRemove,
  } = useInterviewEdit(companyId, refetch);

  const onCreate = () => {
    handleCreate(refetch);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b bg-gradient-to-r from-primary-50 to-secondary-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold">Interview Management</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Schedule and manage candidate interviews
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-red-800">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              <span className="font-medium">Error</span>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
          </div>
        )}

        <CreateInterviewForm
          createForm={createForm}
          jobsList={jobsList}
          eligibleApplicants={eligibleApplicants}
          loadingJobs={loadingJobs}
          loadingApplicants={loadingApplicants}
          creating={creating}
          onJobChange={handleJobChange}
          onItemChange={handleItemChange}
          onAddItem={addItem}
          onRemoveItem={removeItem}
          onCreate={onCreate}
        />

        <div className="bg-card rounded-xl shadow-md border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#467EC7]">
                <path d="M8 2v4"/>
                <path d="M16 2v4"/>
                <rect width="18" height="18" x="3" y="4" rx="2"/>
                <path d="M3 10h18"/>
              </svg>
              Interview Schedules
            </h3>
            <div className="text-sm text-muted-foreground">
              {loading ? "Loading..." : `${data.total} total interviews`}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#24CFA7]"></div>
            </div>
          ) : (
            <>
              <InterviewsTable
                items={data.items}
                onEdit={onEdit}
                onCancel={onCancel}
                onComplete={onComplete}
                onRemove={onRemove}
              />
              <InterviewPagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </>
          )}
        </div>

        <EditInterviewModal
          editingInterview={editingInterview}
          editForm={editForm}
          updating={updating}
          onClose={onCloseModal}
          onSave={onSaveEdit}
          onFormChange={onFormChange}
        />
      </div>
    </div>
  );
}
