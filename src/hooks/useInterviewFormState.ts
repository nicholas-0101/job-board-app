import { useState } from "react";

export function useInterviewFormState() {
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
    items: [] 
  });

  const [creating, setCreating] = useState(false);

  // Jobs list for dropdown
  const [jobsList, setJobsList] = useState<Array<{
    id: number;
    title: string;
    category: string;
    city: string;
    eligibleApplicantsCount: number;
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

  return {
    createForm,
    setCreateForm,
    creating,
    setCreating,
    jobsList,
    setJobsList,
    loadingJobs,
    setLoadingJobs,
    eligibleApplicants,
    setEligibleApplicants,
    loadingApplicants,
    setLoadingApplicants,
  };
}
