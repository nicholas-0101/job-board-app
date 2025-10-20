import { apiCall } from "@/helper/axios";

export interface InterviewItemDTO {
  id: number;
  applicationId: number;
  scheduleDate: string;
  locationOrLink?: string | null;
  notes?: string | null;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
  candidateName: string;
  jobTitle: string;
}

export interface InterviewListDTO {
  total: number;
  limit: number;
  offset: number;
  items: InterviewItemDTO[];
}

export async function listCompanyInterviews(params: {
  companyId: number;
  jobId?: number;
  applicantId?: number;
  status?: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}) {
  const { companyId, ...query } = params;
  
  if (!companyId || Number.isNaN(companyId)) {
    throw new Error("Invalid company ID provided");
  }
  
  try {
    const res = await apiCall.get<{ success: boolean; data: InterviewListDTO }>(
      `/interview/companies/${companyId}/interviews`,
      { params: query }
    );
    return res.data.data;
  } catch (error: any) {
    console.error(`Error fetching interviews for company ${companyId}:`, error);
    
    // Handle specific error cases
    if (error?.response?.status === 401) {
      throw new Error("Unauthorized access to company interviews. Please check your permissions.");
    } else if (error?.response?.status === 404) {
      throw new Error("Company not found. Please check if the company exists.");
    } else if (error?.response?.status === 500) {
      throw new Error("Server error while fetching interviews. Please try again later.");
    }
    
    // Re-throw the original error for other cases
    throw error;
  }
}

export async function createSchedules(params: {
  companyId: number;
  jobId: number;
  items: Array<{ applicantId: number; scheduleDate: string; locationOrLink?: string | null; notes?: string | null }>;
}) {
  const { companyId, jobId, items } = params;
  const res = await apiCall.post(`/interview/companies/${companyId}/jobs/${jobId}/interviews`, {
    items,
  });
  return res.data;
}

export async function updateInterview(params: {
  companyId: number;
  id: number;
  scheduleDate?: string;
  locationOrLink?: string | null;
  notes?: string | null;
  status?: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
}) {
  const { companyId, id, ...body } = params;
  const res = await apiCall.put(`/interview/companies/${companyId}/interviews/${id}`,
    body
  );
  return res.data;
}

export async function deleteInterview(params: { companyId: number; id: number }) {
  const { companyId, id } = params;
  const res = await apiCall.delete(`/interview/companies/${companyId}/interviews/${id}`);
  return res.data;
}

export interface JobWithApplicantCountDTO {
  id: number;
  title: string;
  category: string;
  city: string;
  acceptedApplicantsCount: number;
}

export interface EligibleApplicantDTO {
  userId: number;
  userName: string;
  userEmail: string;
  applicationId: number;
}

export async function getJobsWithApplicantCounts(companyId: number): Promise<JobWithApplicantCountDTO[]> {
  const res = await apiCall.get<{ success: boolean; data: JobWithApplicantCountDTO[] }>(
    `/interview/companies/${companyId}/jobs-with-applicants`
  );
  return res.data.data;
}

export async function getEligibleApplicants(companyId: number, jobId: number): Promise<EligibleApplicantDTO[]> {
  const res = await apiCall.get<{ success: boolean; data: EligibleApplicantDTO[] }>(
    `/interview/companies/${companyId}/jobs/${jobId}/eligible-applicants`
  );
  return res.data.data;
}


