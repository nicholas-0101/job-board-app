import { useInterviewFormState } from "./useInterviewFormState";
import { useInterviewFormActions } from "./useInterviewFormActions";

export function useInterviewForm(companyId: number) {
  const {
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
  } = useInterviewFormState();

  const {
    addItem,
    removeItem,
    handleJobChange,
    handleItemChange,
    handleCreate,
  } = useInterviewFormActions(
    companyId,
    createForm,
    setCreateForm,
    setJobsList,
    setEligibleApplicants,
    setLoadingJobs,
    setLoadingApplicants,
    setCreating
  );

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
