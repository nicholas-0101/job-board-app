import { apiCall } from "@/helper/axios";

export interface ApplicantItemDTO {
  id: number; // applicationId
  userId: number;
  name: string;
  email?: string;
  profilePicture?: string | null;
  education?: string | null;
  expectedSalary?: number | null;
  age?: number | null;
  status: "SUBMITTED" | "IN_REVIEW" | "INTERVIEW" | "ACCEPTED" | "REJECTED";
  appliedAt: string;
  cvFile: string;
}

export interface ApplicantsListDTO {
  total: number;
  limit: number;
  offset: number;
  items: ApplicantItemDTO[];
}

export async function listApplicants(params: {
  companyId: number;
  jobId: number;
  name?: string;
  education?: string;
  ageMin?: number;
  ageMax?: number;
  expectedSalaryMin?: number;
  expectedSalaryMax?: number;
  sortBy?: "appliedAt" | "expectedSalary" | "age";
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}): Promise<ApplicantsListDTO> {
  const { companyId, jobId, ...query } = params;
  const res = await apiCall.get<{ success: boolean; data: ApplicantsListDTO }>(
    `/job/companies/${companyId}/jobs/${jobId}/applicants`,
    { params: query }
  );
  return res.data.data;
}

export async function updateApplicantStatus(params: {
  companyId: number;
  jobId: number;
  applicationId: number;
  status: "IN_REVIEW" | "INTERVIEW" | "ACCEPTED" | "REJECTED";
  reviewNote?: string;
}) {
  const { companyId, jobId, applicationId, status, reviewNote } = params;
  const res = await apiCall.put<{ success: boolean; data: { id: number; status: string; reviewNote?: string; updatedAt: string } }>(
    `/job/companies/${companyId}/jobs/${jobId}/applications/${applicationId}/status`,
    { status, reviewNote }
  );
  return res.data.data;
}


