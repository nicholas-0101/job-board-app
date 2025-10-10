import { apiCall } from "@/helper/axios";

export async function getDemographics(companyId: number, params?: { from?: string; to?: string }) {
  const res = await apiCall.get<{ success: boolean; data: { ageBuckets: Record<string, number>; gender: Array<{ gender: string; count: number }>; locations: Array<{ city: string; count: number }>; totalApplicants: number } }>(
    `/analytics/companies/${companyId}/analytics/demographics`,
    { params }
  );
  const data = res.data.data;
  // Normalize gender to an object map to fit UI helper logic
  const genderMap: Record<string, number> = {};
  for (const g of data.gender || []) genderMap[g.gender] = g.count;
  return { ...data, gender: genderMap } as any;
}

export async function getSalaryTrends(companyId: number, params?: { from?: string; to?: string }) {
  const res = await apiCall.get<{ success: boolean; data: { expectedSalary: Array<{ city: string; title: string; avgExpectedSalary: number; samples: number }>; reviewSalary: { avgSalaryEstimate: number | null; samples: number } } }>(
    `/analytics/companies/${companyId}/analytics/salary-trends`,
    { params }
  );
  const { expectedSalary } = res.data.data;
  // Aggregate by position (title)
  const byTitle = new Map<string, { sum: number; n: number; min: number; max: number }>();
  for (const row of expectedSalary || []) {
    const cur = byTitle.get(row.title) || { sum: 0, n: 0, min: Number.POSITIVE_INFINITY, max: 0 };
    cur.sum += row.avgExpectedSalary * (row.samples || 1);
    cur.n += (row.samples || 1);
    cur.min = Math.min(cur.min, row.avgExpectedSalary);
    cur.max = Math.max(cur.max, row.avgExpectedSalary);
    byTitle.set(row.title, cur);
  }
  const byPosition = Array.from(byTitle.entries()).map(([position, v]) => ({
    position,
    min: v.min === Number.POSITIVE_INFINITY ? 0 : Math.round(v.min),
    max: Math.round(v.max),
    avg: v.n ? Math.round(v.sum / v.n) : 0,
    count: v.n,
  }));
  // Aggregate by location (city)
  const byCity = new Map<string, { sum: number; n: number }>();
  for (const row of expectedSalary || []) {
    const cur = byCity.get(row.city) || { sum: 0, n: 0 };
    cur.sum += row.avgExpectedSalary * (row.samples || 1);
    cur.n += (row.samples || 1);
    byCity.set(row.city, cur);
  }
  const byLocation = Array.from(byCity.entries()).map(([city, v]) => ({
    city,
    avg: v.n ? Math.round(v.sum / v.n) : 0,
    growth: 0,
  }));
  return { byPosition, byLocation } as any;
}

export async function getInterests(companyId: number, params?: { from?: string; to?: string }) {
  const res = await apiCall.get<{ success: boolean; data: { byCategory: Array<{ category: string; count: number }> } }>(
    `/analytics/companies/${companyId}/analytics/interests`,
    { params }
  );
  const list = res.data.data.byCategory || [];
  const total = list.reduce((s, x) => s + (x.count || 0), 0) || 1;
  return list.map((x) => ({ category: x.category, applications: x.count, percentage: Math.round((x.count * 100) / total) }));
}

export async function getOverview(companyId: number, params?: { from?: string; to?: string }) {
  const res = await apiCall.get<{ success: boolean; data: { totals: { usersTotal: number; jobsTotal: number; applicationsTotal: number }; applicationStatus: Array<{ status: string; count: number }>; topCities: Array<{ city: string; count: number }> } }>(
    `/analytics/companies/${companyId}/analytics/overview`,
    { params }
  );
  const data = res.data.data;
  return {
    totalUsers: data.totals.usersTotal,
    activeJobs: data.totals.jobsTotal,
    applications: data.totals.applicationsTotal,
    companies: 1,
    growth: { users: 0, jobs: 0, applications: 0, companies: 0 },
    status: data.applicationStatus,
    topCities: data.topCities,
  } as any;
}

export async function getEngagement(companyId: number, params?: { from?: string; to?: string }) {
  const res = await apiCall.get<{ success: boolean; data: any }>(
    `/analytics/companies/${companyId}/analytics/engagement`,
    { params }
  );
  return res.data.data;
}

export async function getConversionFunnel(companyId: number, params?: { from?: string; to?: string }) {
  const res = await apiCall.get<{ success: boolean; data: any }>(
    `/analytics/companies/${companyId}/analytics/conversion-funnel`,
    { params }
  );
  return res.data.data;
}

export async function getRetention(companyId: number, params?: { from?: string; to?: string }) {
  const res = await apiCall.get<{ success: boolean; data: any }>(
    `/analytics/companies/${companyId}/analytics/retention`,
    { params }
  );
  return res.data.data;
}

export async function getPerformance(companyId: number, params?: { from?: string; to?: string }) {
  const res = await apiCall.get<{ success: boolean; data: any }>(
    `/analytics/companies/${companyId}/analytics/performance`,
    { params }
  );
  return res.data.data;
}


