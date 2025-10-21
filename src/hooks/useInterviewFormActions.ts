import { useEffect } from "react";
import { getJobsWithApplicantCounts, getEligibleApplicants, createSchedules } from "@/lib/interviews";

export function useInterviewFormActions(
  companyId: number,
  createForm: { jobId: string; items: Array<{ applicantId: string; scheduleDate: string; locationOrLink?: string; notes?: string; }> },
  setCreateForm: (form: any) => void,
  setJobsList: (jobs: any[]) => void,
  setEligibleApplicants: (applicants: any[]) => void,
  setLoadingJobs: (loading: boolean) => void,
  setLoadingApplicants: (loading: boolean) => void,
  setCreating: (creating: boolean) => void
) {
  // Fetch jobs for dropdown
  useEffect(() => {
    const fetchJobs = async () => {
      if (!companyId || Number.isNaN(companyId)) return;
      
      setLoadingJobs(true);
      try {
        const jobs = await getJobsWithApplicantCounts(companyId);
        setJobsList(jobs);
      } catch (e: any) {
        console.error("Failed to load jobs:", e);
      } finally {
        setLoadingJobs(false);
      }
    };

    fetchJobs();
  }, [companyId, setJobsList, setLoadingJobs]);

  // Fetch eligible applicants when job is selected
  useEffect(() => {
    const fetchApplicants = async () => {
      if (!companyId || Number.isNaN(companyId) || !createForm.jobId) {
        setEligibleApplicants([]);
        return;
      }
      
      setLoadingApplicants(true);
      try {
        const applicants = await getEligibleApplicants(companyId, Number(createForm.jobId));
        setEligibleApplicants(applicants);
      } catch (e: any) {
        console.error("Failed to load applicants:", e);
        console.error("Error details:", e.response?.data || e.message);
        setEligibleApplicants([]);
      } finally {
        setLoadingApplicants(false);
      }
    };

    fetchApplicants();
  }, [companyId, createForm.jobId, setEligibleApplicants, setLoadingApplicants]);

  const addItem = () => setCreateForm((f: any) => ({ 
    ...f, 
    items: [...f.items, { applicantId: "", scheduleDate: "", locationOrLink: "", notes: "" }] 
  }));

  const removeItem = (idx: number) => setCreateForm((f: any) => ({ 
    ...f, 
    items: f.items.filter((_: any, i: number) => i !== idx) 
  }));

  const handleJobChange = (jobId: string) => {
    setCreateForm((f: any) => ({ 
      ...f, 
      jobId, 
      items: [] // Reset items when job changes; admin must add candidates manually
    }));
  };

  const handleItemChange = (index: number, field: string, value: string) => {
    setCreateForm((f: any) => ({
      ...f,
      items: f.items.map((x: any, i: number) => 
        i === index ? { ...x, [field]: value } : x
      )
    }));
  };

  const handleCreate = async (onSuccess: () => void) => {
    if (!companyId || Number.isNaN(companyId)) {
      alert("Company information is missing. Please refresh and try again.");
      return;
    }
    if (!createForm.jobId) {
      alert("Please select a job before scheduling interviews.");
      return;
    }
    if (!createForm.items.length) {
      alert("Add at least one candidate before creating schedules.");
      return;
    }
    const hasIncompleteItem = createForm.items.some(
      (item) => !item.applicantId || !item.scheduleDate
    );
    if (hasIncompleteItem) {
      alert("Please select a candidate and schedule date for each entry.");
      return;
    }

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
      setCreateForm({ 
        jobId: "", 
        items: [] 
      });
      onSuccess();
    } catch (e: any) {
      alert(e?.response?.data?.message || "Failed to create schedules");
    } finally {
      setCreating(false);
    }
  };

  return {
    addItem,
    removeItem,
    handleJobChange,
    handleItemChange,
    handleCreate,
  };
}
