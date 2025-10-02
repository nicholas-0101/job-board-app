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
  testScore?: number | null;
  testPassed?: boolean | null;
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
  const res = await apiCall.get<{ success: boolean; data: any }>(
    `/job/companies/${companyId}/jobs/${jobId}/applicants`,
    { params: query }
  );
  const data = res.data.data;
  const toAge = (dob?: string | null) => {
    if (!dob) return null;
    const d = new Date(dob);
    if (isNaN(d.getTime())) return null;
    const now = new Date();
    let age = now.getFullYear() - d.getFullYear();
    const m = now.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
    return age;
  };
  const items: ApplicantItemDTO[] = (data.items || []).map((a: any) => ({
    id: a.applicationId,
    userId: a.user?.id,
    name: a.user?.name,
    email: a.user?.email,
    profilePicture: a.user?.profilePicture ?? null,
    education: a.user?.education ?? null,
    expectedSalary: a.expectedSalary ?? null,
    age: toAge(a.user?.dob ?? null),
    status: a.status,
    appliedAt: a.appliedAt,
    cvFile: a.cvFile,
    testScore: a.testScore ?? null,
    testPassed: typeof a.preselectionPassed === 'boolean' ? a.preselectionPassed : null,
  }));
  return { total: data.total, limit: data.limit, offset: data.offset, items };
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


