import axios from "axios";

const DEFAULT_BASE_URL = process.env.NEXT_PUBLIC_BE_URL || "http://localhost:4400";
const resolvedBaseURL =
  process.env.NEXT_PUBLIC_BE_URL || DEFAULT_BASE_URL;

export const apiCall = axios.create({
  baseURL: resolvedBaseURL,
  withCredentials: false,
});

apiCall.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") || localStorage.getItem("verifiedToken");

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to suppress preselection 404 errors
apiCall.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Suppress 404 errors for preselection test endpoints
    if (error.response?.status === 404 && 
        error.config?.url?.includes('/preselection/jobs/') && 
        error.config?.url?.includes('/tests')) {
      // Return a mock successful response instead of rejecting
      return Promise.resolve({
        data: { data: null },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: error.config,
        request: error.request
      });
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("verifiedToken");
      window.location.href = "/auth/signin";
    }
    return Promise.reject(error);
  }
);