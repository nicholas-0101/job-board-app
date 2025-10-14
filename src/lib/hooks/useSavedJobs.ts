"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { apiCall } from "@/helper/axios";

interface SavedJob {
  id: number;
  createdAt: string;
  job: {
    id: number;
    slug: string;
    title: string;
    city: string;
    company: {
      id: number;
      name: string;
      logoUrl: string | null;
    };
    category: string;
    salaryMin: number;
    salaryMax: number;
    tags: string[];
    rating?: number;
  };
}

interface DecodedToken {
  id: number;
  userId: number;
  [key: string]: any;
}

export function useSavedJobs() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [limit] = useState(3);
  const [total, setTotal] = useState(0);
  const router = useRouter();

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const fetchSavedJobs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/go-to-signin");
        return;
      }

      const decoded: DecodedToken = jwtDecode(token);
      const userId = decoded.userId;

      const res = await apiCall.get(`/save/user/${userId}`, {
        params: { page, limit },
        headers: { Authorization: `Bearer ${token}` },
      });

      setSavedJobs(res.data.data || []);
      setTotal(res.data.pagination?.total || res.data.data.length || 0);
    } catch (err) {
      console.error("Failed to fetch saved jobs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, [page]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    setSavedJobs((prev) =>
      [...prev].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      })
    );
  };

  return {
    savedJobs,
    loading,
    sortOrder,
    page,
    totalPages,
    toggleSortOrder,
    setPage,
  };
}
