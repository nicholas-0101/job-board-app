"use client";
import { useEffect } from "react";
import { useApplicantsPageState as useApplicantsPageStateHook } from "./useApplicantsPageState";
import { useApplicantsPageStats } from "./useApplicantsPageStats";
import { 
  fetchCompanyId, 
  fetchJobs, 
  fetchApplicantsFromAllJobs, 
  handleUpdateApplicantStatus 
} from "./useApplicantsPageHelpers";

export type SortBy = "appliedAt" | "expectedSalary" | "age";
export type SortOrder = "asc" | "desc";

export function useApplicantsPageState() {
  const {
    companyId,
    setCompanyId,
    loading,
    setLoading,
    applicants,
    setApplicants,
    total,
    setTotal,
    jobs,
    setJobs,
    jobsLoaded,
    setJobsLoaded,
    searchName,
    setSearchName,
    education,
    setEducation,
    ageMin,
    setAgeMin,
    ageMax,
    setAgeMax,
    salaryMin,
    setSalaryMin,
    salaryMax,
    setSalaryMax,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    page,
    setPage,
    limit,
  } = useApplicantsPageStateHook();

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const cid = await fetchCompanyId(companyId);
      if (!cid || Number.isNaN(cid)) throw new Error("Company not found");

      if (jobs.length === 0) {
        setApplicants([]);
        setTotal(0);
        return;
      }
      
      const { allApplicants, totalCount } = await fetchApplicantsFromAllJobs(jobs, cid, {
        searchName,
        education,
        ageMin,
        ageMax,
        salaryMin,
        salaryMax,
        sortBy,
        sortOrder,
      });
      
      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedApplicants = allApplicants.slice(startIndex, endIndex);
      
      setApplicants(paginatedApplicants);
      setTotal(totalCount);
    } catch (err: any) {
      console.error("Failed to load applicants:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const cid = await fetchCompanyId(companyId);
        if (!isMounted) return;
        if (cid && !Number.isNaN(cid)) {
          if (typeof window !== "undefined") localStorage.setItem("companyId", cid.toString());
          setCompanyId(cid);
          const jobsData = await fetchJobs(cid);
          if (!isMounted) return;
          setJobs(jobsData);
          setJobsLoaded(true);
          if (jobsData.length === 0) {
            setApplicants([]);
            setTotal(0);
            setLoading(false);
          }
        } else {
          setJobs([]);
          setJobsLoaded(true);
          setApplicants([]);
          setTotal(0);
          setLoading(false);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error("Failed to load company or jobs:", err);
        setJobs([]);
        setJobsLoaded(true);
        setApplicants([]);
        setTotal(0);
        setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!jobsLoaded) return;
    if (jobs.length === 0) {
      setApplicants([]);
      setTotal(0);
      setLoading(false);
      return;
    }
    fetchApplicants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobsLoaded, jobs, sortBy, sortOrder, page]);

  const handleApplyFilters = () => {
    setPage(1);
    fetchApplicants();
  };

  const handleUpdateStatus = async (applicationId: number, newStatus: string) => {
    const success = await handleUpdateApplicantStatus(applicationId, newStatus, applicants, companyId);
    if (success) {
      fetchApplicants();
    }
  };

  const stats = useApplicantsPageStats(applicants, total);
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    companyId,
    loading,
    applicants,
    total,
    jobs,
    searchName,
    setSearchName,
    education,
    setEducation,
    ageMin,
    setAgeMin,
    ageMax,
    setAgeMax,
    salaryMin,
    setSalaryMin,
    salaryMax,
    setSalaryMax,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    page,
    setPage,
    limit,
    fetchApplicants,
    handleApplyFilters,
    handleUpdateStatus,
    stats,
    totalPages,
  } as const;
}


