import axios from "axios";

export const apiCall = axios.create({
  baseURL: "http://localhost:4400", 
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
