import { JobWithApplicantCountDTO, EligibleApplicantDTO } from "@/lib/interviews";

interface CreateInterviewFormProps {
  createForm: {
    jobId: string;
    items: Array<{
      applicantId: string;
      scheduleDate: string;
      locationOrLink?: string;
      notes?: string;
    }>;
  };
  jobsList: JobWithApplicantCountDTO[];
  eligibleApplicants: EligibleApplicantDTO[];
  loadingJobs: boolean;
  loadingApplicants: boolean;
  creating: boolean;
  onJobChange: (jobId: string) => void;
  onFormChange: (form: any) => void;
  onAddItem: () => void;
  onRemoveItem: (idx: number) => void;
  onCreate: () => void;
}

export function CreateInterviewForm({
  createForm, jobsList, eligibleApplicants, loadingJobs, loadingApplicants,
  creating, onJobChange, onFormChange, onAddItem, onRemoveItem, onCreate
}: CreateInterviewFormProps) {
  return (
    <div className="bg-card rounded-xl shadow-md border p-6">
      <h2 className="font-semibold mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#24CFA7]"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>
        Create Interview Schedules
      </h2>
      <div className="grid gap-3 md:grid-cols-4 mb-4">
        <div className="relative">
          <select value={createForm.jobId} onChange={(e) => onJobChange(e.target.value)} className="px-3 py-2 border rounded-xl bg-background w-full appearance-none" disabled={loadingJobs}>
            <option value="">Select a job...</option>
            {jobsList.map((job) => (
              <option key={job.id} value={job.id}>{job.title} ({job.acceptedApplicantsCount} eligible applicants)</option>
            ))}
          </select>
          {loadingJobs && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            </div>
          )}
        </div>
      </div>
      <div className="space-y-3">
        {createForm.items.map((it, idx) => (
          <div key={idx} className="grid gap-3 md:grid-cols-5 p-4 bg-secondary/30 rounded-xl">
            <div className="relative">
              <select value={it.applicantId} onChange={(e)=>onFormChange({...createForm, items: createForm.items.map((x,i)=> i===idx?{...x, applicantId: e.target.value}:x)})} className="px-3 py-2 border rounded-xl bg-background w-full appearance-none" disabled={!createForm.jobId || loadingApplicants}>
                <option value="">Select applicant...</option>
                {eligibleApplicants.map((applicant) => (
                  <option key={applicant.userId} value={applicant.userId}>{applicant.userName} ({applicant.userEmail})</option>
                ))}
              </select>
              {loadingApplicants && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                </div>
              )}
            </div>
            <input type="datetime-local" value={it.scheduleDate} onChange={(e)=>onFormChange({...createForm, items: createForm.items.map((x,i)=> i===idx?{...x, scheduleDate: e.target.value}:x)})} className="px-3 py-2 border rounded-xl bg-background" />
            <input value={it.locationOrLink} onChange={(e)=>onFormChange({...createForm, items: createForm.items.map((x,i)=> i===idx?{...x, locationOrLink: e.target.value}:x)})} placeholder="Location/Link" className="px-3 py-2 border rounded-xl bg-background" />
            <input value={it.notes} onChange={(e)=>onFormChange({...createForm, items: createForm.items.map((x,i)=> i===idx?{...x, notes: e.target.value}:x)})} placeholder="Notes" className="px-3 py-2 border rounded-xl bg-background" />
            <button onClick={()=>onRemoveItem(idx)} className="px-3 py-2 border border-red-300 rounded-xl hover:bg-red-50 text-red-600 transition-colors">Remove</button>
          </div>
        ))}
      </div>
      <div className="flex gap-3 mt-4">
        <button onClick={onAddItem} className="px-4 py-2 border rounded-xl hover:bg-secondary transition-colors flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Add Candidate
        </button>
        <button onClick={onCreate} disabled={creating} className="px-6 py-2 bg-[#24CFA7] hover:bg-[#1fc39c] text-white rounded-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          {creating?"Creating...":"Create Schedules"}
        </button>
      </div>
    </div>
  );
}

