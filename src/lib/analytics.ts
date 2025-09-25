import { apiCall } from "@/helper/axios";

export async function getDemographics(companyId: number, params?: { from?: string; to?: string }) {
  const res = await apiCall.get(`/analytics/companies/${companyId}/analytics/demographics`, { params });
  return res.data.data;
}

export async function getSalaryTrends(companyId: number, params?: { from?: string; to?: string }) {
  const res = await apiCall.get(`/analytics/companies/${companyId}/analytics/salary-trends`, { params });
  return res.data.data;
}

export async function getInterests(companyId: number, params?: { from?: string; to?: string }) {
  const res = await apiCall.get(`/analytics/companies/${companyId}/analytics/interests`, { params });
  return res.data.data;
}

export async function getOverview(companyId: number, params?: { from?: string; to?: string }) {
  const res = await apiCall.get(`/analytics/companies/${companyId}/analytics/overview`, { params });
  return res.data.data;
}


