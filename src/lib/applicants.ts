import { apiCall } from "@/helper/axios";

export interface ApplicantDTO {
  applicationId: number;
  userId: number;
  userName: string;
  userEmail: string;
  profilePicture: string | null;
  expectedSalary: number | null;
  cvFile: string | null;
  score: number | null;
  preselectionPassed: boolean | undefined;
  status: string;
  appliedAt: string;
  isPriority?: boolean; // ← IMPORTANT: Add priority field
  education?: string;
  age?: number;
  city?: string;
}

// Alias for backward compatibility
export type ApplicantItemDTO = ApplicantDTO & {
  id: number; // Same as applicationId
  name: string; // Same as userName
  email: string; // Same as userEmail
  testScore: number | null; // Same as score
  testPassed: boolean | undefined; // Same as preselectionPassed
};

export interface ApplicantsListResponse {
  items: ApplicantDTO[];
  total: number;
  limit: number;
  offset: number;
}

export async function listJobApplicants(params: {
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
}): Promise<ApplicantsListResponse> {
  const { companyId, jobId, ...queryParams } = params;

  const cleanParams: Record<string, any> = {};
  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      cleanParams[key] = value;
    }
  });

  const response = await apiCall.get(
    `/job/companies/${companyId}/jobs/${jobId}/applicants`,
    { params: cleanParams }
  );

  return response.data.data;
}

export async function updateApplicantStatus(params: {
  companyId: number;
  jobId: number;
  applicationId: number;
  status: string;
  reviewNote?: string;
}): Promise<void> {
  const { companyId, jobId, applicationId, ...body } = params;

  await apiCall.put(
    `/job/companies/${companyId}/jobs/${jobId}/applications/${applicationId}/status`,
    body
  );
}

// Alias for backward compatibility with existing code
export const listApplicants = listJobApplicants;
