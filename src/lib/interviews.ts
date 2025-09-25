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
  const res = await apiCall.get<{ success: boolean; data: InterviewListDTO }>(
    `/interview/companies/${companyId}/interviews`,
    { params: query }
  );
  return res.data.data;
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


