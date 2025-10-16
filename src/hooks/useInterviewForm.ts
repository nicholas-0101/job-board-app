import { useState, useEffect } from "react";
import { getJobsWithApplicantCounts, getEligibleApplicants, createSchedules } from "@/lib/interviews";

export function useInterviewForm(companyId: number) {
  const [createForm, setCreateForm] = useState<{ 
    jobId: string; 
    items: Array<{ 
      applicantId: string; 
      scheduleDate: string; 
      locationOrLink?: string; 
      notes?: string; 
    }> 
  }>({
    jobId: "", 
    items: [{ applicantId: "", scheduleDate: "", locationOrLink: "", notes: "" }] 
  });

  const [creating, setCreating] = useState(false);

  // Jobs list for dropdown
  const [jobsList, setJobsList] = useState<Array<{
    id: number;
    title: string;
    category: string;
    city: string;
    acceptedApplicantsCount: number;
  }>>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);

  // Eligible applicants for selected job
  const [eligibleApplicants, setEligibleApplicants] = useState<Array<{
    userId: number;
    userName: string;
    userEmail: string;
    applicationId: number;
  }>>([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

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
  }, [companyId]);

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
        setEligibleApplicants([]);
      } finally {
        setLoadingApplicants(false);
      }
    };

    fetchApplicants();
  }, [companyId, createForm.jobId]);

  const addItem = () => setCreateForm((f) => ({ 
    ...f, 
    items: [...f.items, { applicantId: "", scheduleDate: "", locationOrLink: "", notes: "" }] 
  }));

  const removeItem = (idx: number) => setCreateForm((f) => ({ 
    ...f, 
    items: f.items.filter((_, i) => i !== idx) 
  }));

  const handleJobChange = (jobId: string) => {
    setCreateForm((f) => ({ 
      ...f, 
      jobId, 
      items: [{ applicantId: "", scheduleDate: "", locationOrLink: "", notes: "" }] // Reset items when job changes
    }));
  };

  const handleItemChange = (index: number, field: string, value: string) => {
    setCreateForm((f) => ({
      ...f,
      items: f.items.map((x, i) => 
        i === index ? { ...x, [field]: value } : x
      )
    }));
  };

  const handleCreate = async (onSuccess: () => void) => {
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
        items: [{ applicantId: "", scheduleDate: "", locationOrLink: "", notes: "" }] 
      });
      onSuccess();
    } catch (e: any) {
      alert(e?.response?.data?.message || "Failed to create schedules");
    } finally {
      setCreating(false);
    }
  };

  return {
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
  };
}
