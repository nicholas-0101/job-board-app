import axios from "axios";

export const apiCall = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BE_URL,
  withCredentials: false,
});

apiCall.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") || localStorage.getItem("verifiedToken");

  if (token && config.headers) {
    (config.headers as any).set?.("Authorization", `Bearer ${token}`);
  }

  return config;
});
