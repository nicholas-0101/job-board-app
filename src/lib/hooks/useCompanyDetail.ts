"use client";

import { useState, useEffect } from "react";
import { apiCall } from "@/helper/axios";

export function useCompanyDetail(slug: string) {
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reviewRefreshTrigger, setReviewRefreshTrigger] = useState(0);

  useEffect(() => {
    if (!slug) return;

    const fetchCompany = async () => {
      try {
        const res = await apiCall.get(`/company/${slug}`);
        setCompany(res.data.data);
      } catch (err) {
        console.error("Failed to fetch company:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [slug]);

  const handleReviewSubmitted = () => {
    setReviewRefreshTrigger(prev => prev + 1);
  };

  return {
    company,
    loading,
    reviewRefreshTrigger,
    handleReviewSubmitted,
  };
}
