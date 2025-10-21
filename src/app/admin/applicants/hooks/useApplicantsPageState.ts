"use client";
import { useState } from "react";
import { Users, Star, Clock, UserCheck, CheckCircle } from "lucide-react";
import { listCompanyJobs, JobItemDTO } from "@/lib/jobs";
import { listJobApplicants, updateApplicantStatus, ApplicantDTO } from "@/lib/applicants";
import { apiCall } from "@/helper/axios";

// Extended type that includes jobId which is added dynamically
export type ApplicantWithJobId = ApplicantDTO & {
  jobId: number;
  jobTitle: string;
};

export type SortBy = "appliedAt" | "expectedSalary" | "age";
export type SortOrder = "asc" | "desc";

export function useApplicantsPageState() {
  const [companyId, setCompanyId] = useState<number>(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem("companyId") : null;
    return raw ? Number(raw) : NaN;
  });

  const [loading, setLoading] = useState(true);
  const [applicants, setApplicants] = useState<ApplicantWithJobId[]>([]);
  const [total, setTotal] = useState(0);
  const [jobs, setJobs] = useState<JobItemDTO[]>([]);
  const [jobsLoaded, setJobsLoaded] = useState(false);

  const [searchName, setSearchName] = useState("");
  const [education, setEducation] = useState("");
  const [ageMin, setAgeMin] = useState("");
  const [ageMax, setAgeMax] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("appliedAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  return {
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
  };
}
