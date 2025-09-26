import axios from "axios";

export const apiCall = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BE_URL,  
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

apiCall.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiCall.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Axios Error:", error);
    return Promise.reject(error);
  }
);
