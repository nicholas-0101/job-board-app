import { listCompanyJobs, JobItemDTO } from "@/lib/jobs";
import { listJobApplicants, updateApplicantStatus, ApplicantDTO } from "@/lib/applicants";
import { apiCall } from "@/helper/axios";
import { ApplicantWithJobId } from "./useApplicantsPageState";

export async function fetchCompanyId(companyId: number) {
  if (!companyId || Number.isNaN(companyId)) {
    try {
      const resp = await apiCall.get("/company/admin");
      const data = resp.data?.data ?? resp.data;
      const resolved = Number(data?.id ?? data?.data?.id);
      if (resolved) {
        if (typeof window !== "undefined") localStorage.setItem("companyId", resolved.toString());
        return resolved;
      }
    } catch {}
  }
  return companyId;
}

export async function fetchJobs(cid: number) {
  try {
    const response = await listCompanyJobs({ companyId: cid, limit: 100, offset: 0 });
    return response.items;
  } catch (err) {
    console.error("Failed to load jobs:", err);
    return [];
  }
}

export async function fetchApplicantsFromAllJobs(
  jobs: JobItemDTO[],
  cid: number,
  filters: {
    searchName: string;
    education: string;
    ageMin: string;
    ageMax: string;
    salaryMin: string;
    salaryMax: string;
    sortBy: "appliedAt" | "expectedSalary" | "age";
    sortOrder: "asc" | "desc";
  }
): Promise<{ allApplicants: ApplicantWithJobId[]; totalCount: number }> {
  const allApplicants: ApplicantWithJobId[] = [];
  let totalCount = 0;
  
  for (const job of jobs) {
    try {
      const response = await listJobApplicants({
        companyId: cid,
        jobId: job.id,
        name: filters.searchName || undefined,
        education: filters.education || undefined,
        ageMin: filters.ageMin ? Number(filters.ageMin) : undefined,
        ageMax: filters.ageMax ? Number(filters.ageMax) : undefined,
        expectedSalaryMin: filters.salaryMin ? Number(filters.salaryMin) : undefined,
        expectedSalaryMax: filters.salaryMax ? Number(filters.salaryMax) : undefined,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        limit: 100,
        offset: 0,
      });
    
      // Add job title to each applicant
      const applicantsWithJob = response.items.map(applicant => ({
        ...applicant,
        jobTitle: job.title,
        jobId: job.id
      }));
      
      allApplicants.push(...applicantsWithJob);
      totalCount += response.total;
    } catch (jobError: any) {
      console.error(`Failed to fetch applicants for job ${job.title}:`, jobError);
    }
  }
  
  // Sort all applicants by appliedAt (default to desc for newest first)
  allApplicants.sort((a, b) => {
    const dateA = new Date(a.appliedAt).getTime();
    const dateB = new Date(b.appliedAt).getTime();
    return filters.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });
  
  return { allApplicants, totalCount };
}

export async function handleUpdateApplicantStatus(
  applicationId: number,
  newStatus: string,
  applicants: ApplicantWithJobId[],
  companyId: number
) {
  if (!confirm(`Are you sure you want to change status to ${newStatus}?`)) return;
  
  try {
    const cid = await fetchCompanyId(companyId);
    if (!cid || Number.isNaN(cid)) return;
    
    // Find the applicant to get their jobId
    const applicant = applicants.find(app => app.applicationId === applicationId);
    if (!applicant || !applicant.jobId) {
      alert("Applicant job information not found");
      return;
    }
    
    await updateApplicantStatus({ 
      companyId: cid, 
      jobId: applicant.jobId, 
      applicationId, 
      status: newStatus 
    });
    
    return true; // Success
  } catch (err: any) {
    alert(err?.response?.data?.message || "Failed to update status");
    return false;
  }
}
