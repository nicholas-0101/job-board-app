import { apiCall } from "@/helper/axios";
import axios from "axios";

// Create a separate axios instance for preselection tests to suppress 404 errors
const preselectionApiCall = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BE_URL || "http://localhost:4400",
  withCredentials: false,
  // Suppress 404 errors from console logging
  validateStatus: (status) => {
    // Don't treat 404 as error for preselection tests
    if (status === 404) {
      return true;
    }
    return status >= 200 && status < 300;
  },
});

// Add auth interceptor
preselectionApiCall.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") || localStorage.getItem("verifiedToken");

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to suppress 404 error logging
preselectionApiCall.interceptors.response.use(
  (response) => {
    // For 404 responses, we want to suppress the error logging
    if (response.status === 404) {
      // Return a custom response that won't trigger error logging
      return {
        ...response,
        data: null,
        status: 404,
        statusText: 'Not Found',
        headers: response.headers,
        config: response.config,
        request: response.request,
      };
    }
    return response;
  },
  (error) => {
    // Suppress 404 errors from being logged
    if (error.response?.status === 404) {
      // Return a custom response instead of throwing an error
      return {
        data: null,
        status: 404,
        statusText: 'Not Found',
        headers: error.response?.headers || {},
        config: error.config,
        request: error.request,
      };
    }
    // For other errors, also suppress them for preselection endpoints
    if (error.config?.url?.includes('/preselection/jobs/') && error.config?.url?.includes('/tests')) {
      return {
        data: null,
        status: 404,
        statusText: 'Not Found',
        headers: {},
        config: error.config,
        request: error.request,
      };
    }
    // For other errors, let them through
    return Promise.reject(error);
  }
);

export interface PreselectionQuestionDTO {
  id: number;
  question: string;
  options: string[];
  // For admin role, backend includes the answer
  answer?: string;
}

export interface PreselectionTestDTO {
  id: number;
  jobId: number;
  isActive: boolean;
  passingScore?: number | null;
  questions: PreselectionQuestionDTO[];
}

export async function fetchPreselectionTest(jobId: number): Promise<PreselectionTestDTO | null> {
  try {
    const response = await preselectionApiCall.get(`/preselection/jobs/${jobId}/tests`);
    
    // If status is 404 or any error, return null
    if (response.status === 404 || response.status >= 400) {
      return null;
    }
    
    return response.data?.data || null;
  } catch (error) {
    // Any error should return null
    return null;
  }
}

export async function submitPreselectionAnswers(params: {
  applicantId: number;
  testId: number;
  answers: Array<{ questionId: number; selected: string }>;
}) {
  const { applicantId, testId, answers } = params;
  const res = await apiCall.post(`/preselection/applicants/${applicantId}/tests/${testId}/submit`, {
    answers,
  });
  return res.data;
}

export async function upsertPreselectionTest(params: {
  jobId: number;
  isActive: boolean;
  passingScore: number;
  questions: Array<{ question: string; options: string[]; answer: string }>;
}) {
  const { jobId, isActive, passingScore, questions } = params;
  const res = await apiCall.post(`/preselection/jobs/${jobId}/tests`, {
    isActive,
    passingScore,
    questions,
  });
  return res.data;
}

export async function getMyPreselectionStatus(jobId: number) {
  const res = await apiCall.get<{ success: boolean; data: { required: boolean; testId?: number; submitted?: boolean; score?: number | null; passingScore?: number | null; isPassed?: boolean } }>(
    `/preselection/jobs/${jobId}/my-status`
  );
  return res.data.data;
}


