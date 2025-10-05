import axios from "axios";

const DEFAULT_BASE_URL = "http://localhost:4400";
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
