"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { apiCall } from "@/helper/axios";

interface Job {
  id: number;
  slug: string;
  title: string;
  city: string;
  category: string;
  salaryMin: number;
  salaryMax: number;
  company: {
    id: number;
    name: string;
    logo: string | null;
  };
}

interface Application {
  id: number;
  cvUrl: string;
  expectedSalary: number;
  status: string;
  reviewNote?: string;
  job: Job;
  createdAt: string;
}

interface DecodedToken {
  id: number;
  userId: number;
  [key: string]: any;
}

export function useMyApplications() {
  const router = useRouter();
  
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/go-to-signin");
        return;
      }

      const decoded: DecodedToken = jwtDecode(token);
      const userId = decoded.userId;

      const res = await apiCall.get(`/application/user/${userId}`, {
        params: { page, limit },
        headers: { Authorization: `Bearer ${token}` },
      });

      setApplications(res.data.data || []);
      setTotal(res.data.pagination?.total || 0);
    } catch (error) {
      console.error("Failed to fetch applications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [page]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    setApplications((prev) =>
      [...prev].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      })
    );
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return {
    applications,
    loading,
    sortOrder,
    page,
    totalPages,
    toggleSortOrder,
    handlePageChange,
  };
}
