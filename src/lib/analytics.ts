'use client';

const cache = new Map<string, any>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

type QueryLike = Record<string, string | number | boolean | null | undefined>;

const DEFAULT_BASE_URL = "http://localhost:4400";
const BASE_URL = process.env.NEXT_PUBLIC_BE_URL || DEFAULT_BASE_URL;

function getCacheKey(endpoint: string, companyId?: number, params?: any): string {
  const companyKey = companyId ? `company:${companyId}` : "global";
  return `${endpoint}_${companyKey}_${JSON.stringify(params || {})}`;
}

function getCachedData(key: string): any | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

function setCachedData(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() });
}

async function fetchAnalytics<T>(endpoint: string, companyId?: number, params?: QueryLike): Promise<T> {
  const url = new URL(endpoint, BASE_URL);

  if (companyId && !Number.isNaN(companyId)) {
    url.searchParams.set("companyId", String(companyId));
  }

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      url.searchParams.set(key, String(value));
    });
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (typeof window !== "undefined") {
    const token =
      localStorage.getItem("token") || localStorage.getItem("verifiedToken");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers,
  });

  let payload: any = null;
  const text = await response.text();

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch (error) {
      if (!response.ok) {
        throw new Error(
          `Request to ${endpoint} failed with status ${response.status}`
        );
      }
      throw error;
    }
  }

  if (!response.ok) {
    const message = payload?.message || payload?.error || response.statusText;
    throw new Error(message);
  }

  return (payload ?? {}) as T;
}

export async function getDemographics(companyId: number, params?: { from?: string; to?: string }) {
  const cacheKey = getCacheKey('/analytics/platform/demographics', companyId, params);
  const cached = getCachedData(cacheKey);
  
  if (cached) {
    return cached;
  }

  const res = await fetchAnalytics<{ success: boolean; data: { ageBuckets: Record<string, number>; gender: Array<{ gender: string; count: number }>; locations: Array<{ city: string; count: number }>; totalApplicants: number } }>(
    `/analytics/platform/demographics`,
    companyId,
    params
  );
  const data = res.data;
  
  setCachedData(cacheKey, data);
  return data;
}

export async function getSalaryTrends(companyId: number, params?: { from?: string; to?: string }) {
  const cacheKey = getCacheKey('/analytics/platform/salary-trends', companyId, params);
  const cached = getCachedData(cacheKey);
  
  if (cached) {
    return cached;
  }

  const res = await fetchAnalytics<{ success: boolean; data: { byPosition: Array<{ position: string; min: number; max: number; avg: number; count: number }>; byLocation: Array<{ city: string; avg: number; growth: number }>; expectedSalary: Array<{ city: string; title: string; avgExpectedSalary: number; samples: number }>; reviewSalary: { avgSalaryEstimate: number | null; samples: number } } }>(
    `/analytics/platform/salary-trends`,
    companyId,
    params
  );
  const data = res.data;
  
  setCachedData(cacheKey, data);
  return data;
}

export async function getInterests(companyId: number, params?: { from?: string; to?: string }) {
  const cacheKey = getCacheKey('/analytics/platform/interests', companyId, params);
  const cached = getCachedData(cacheKey);
  
  if (cached) {
    return cached;
  }

  const res = await fetchAnalytics<{ success: boolean; data: Array<{ category: string; applications: number; percentage: number }> }>(
    `/analytics/platform/interests`,
    companyId,
    params
  );
  const data = res.data || [];
  
  setCachedData(cacheKey, data);
  return data;
}

export async function getOverview(companyId: number, params?: { from?: string; to?: string }) {
  const cacheKey = getCacheKey('/analytics/platform/overview', companyId, params);
  const cached = getCachedData(cacheKey);
  
  if (cached) {
    return cached;
  }

  const res = await fetchAnalytics<{ success: boolean; data: { totals: { usersTotal: number; companiesTotal: number; jobsTotal: number; applicationsTotal: number }; applicationStatus: Array<{ status: string; count: number }>; topCities: Array<{ city: string; count: number }> } }>(
    `/analytics/platform/overview`,
    companyId,
    params
  );
  const data = res.data;
  const result = {
    totalUsers: data.totals.usersTotal,
    activeJobs: data.totals.jobsTotal,
    applications: data.totals.applicationsTotal,
    companies: data.totals.companiesTotal,
    growth: { users: 0, jobs: 0, applications: 0, companies: 0 },
    status: data.applicationStatus,
    topCities: data.topCities,
  } as any;
  
  setCachedData(cacheKey, result);
  return result;
}

