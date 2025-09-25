import { apiCall } from "@/helper/axios";

export interface JobItemDTO {
  id: number;
  title: string;
  category: string;
  city: string;
  isPublished: boolean;
  deadline?: string | null;
  createdAt: string;
  applicantsCount: number;
}

export interface JobsListDTO {
  total: number;
  limit: number;
  offset: number;
  items: JobItemDTO[];
}

export async function listCompanyJobs(params: {
  companyId: number;
  title?: string;
  category?: string;
  sortBy?: "createdAt" | "deadline";
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}): Promise<JobsListDTO> {
  const { companyId, ...query } = params;
  const res = await apiCall.get<{ success: boolean; data: JobsListDTO }>(
    `/job/companies/${companyId}/jobs`,
    { params: query }
  );
  return res.data.data;
}

export async function togglePublishJob(params: { companyId: number; jobId: number; isPublished: boolean }) {
  const { companyId, jobId, isPublished } = params;
  const res = await apiCall.patch<{ success: boolean; data: { id: number; isPublished: boolean } }>(
    `/job/companies/${companyId}/jobs/${jobId}/publish`,
    { isPublished }
  );
  return res.data.data;
}

export async function createJob(params: {
  companyId: number;
  title: string;
  description: string;
  category: string;
  city: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  tags: string[];
  deadline?: string | null;
}) {
  const { companyId, ...body } = params;
  const res = await apiCall.post(`/job/companies/${companyId}/jobs`, body);
  return res.data;
}

export async function updateJob(params: {
  companyId: number;
  jobId: number;
  title?: string;
  description?: string;
  category?: string;
  city?: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  tags?: string[];
  deadline?: string | null;
  isPublished?: boolean;
}) {
  const { companyId, jobId, ...body } = params;
  const res = await apiCall.put(`/job/companies/${companyId}/jobs/${jobId}`, body);
  return res.data;
}

export async function deleteJob(params: { companyId: number; jobId: number }) {
  const { companyId, jobId } = params;
  const res = await apiCall.delete(`/job/companies/${companyId}/jobs/${jobId}`);
  return res.data;
}


