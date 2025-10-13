"use client";

import { useState, useEffect } from "react";
import { apiCall } from "@/helper/axios";
import { Review, ReviewStats } from "../types/review.types";

export function useReviews(companyId: number, refreshTrigger?: number) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const fetchReviews = async (pageNum = 1) => {
    try {
      const response = await apiCall.get(
        `/reviews/companies/${companyId}/reviews?page=${pageNum}&limit=3`
      );

      if (pageNum === 1) {
        setReviews(response.data.data?.reviews || response.data.data || []);
      } else {
        setReviews((prev) => [
          ...prev,
          ...(response.data.data?.reviews || response.data.data || []),
        ]);
      }

      setHasMore((response.data.data?.reviews || []).length === 3);
      setPage(pageNum);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to load reviews");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiCall.get(
        `/reviews/companies/${companyId}/reviews/stats`
      );
      setStats(response.data.data);
    } catch (error: any) {
      // Don't set error for stats, just log it
    }
  };

  const loadMore = async () => {
    if (!loading && hasMore) {
      setLoading(true);
      await fetchReviews(page + 1);
    }
  };

  const goPrev = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const goNext = async () => {
    const slides = (() => {
      const chunked: Review[][] = [];
      for (let i = 0; i < reviews.length; i += 2) {
        chunked.push(reviews.slice(i, i + 2));
      }
      return chunked;
    })();

    const lastSlideIndex = Math.max(slides.length - 1, 0);
    const isOnLastSlide = currentSlide >= lastSlideIndex;
    
    if (!isOnLastSlide) {
      setCurrentSlide((prev) => prev + 1);
      return;
    }
    
    if (hasMore && !loading) {
      await loadMore();
      setCurrentSlide((prev) =>
        prev < Math.max(slides.length - 1, 0) ? prev + 1 : prev
      );
    }
  };

  const retry = () => {
    setError(null);
    setLoading(true);
    fetchReviews();
    fetchStats();
  };

  useEffect(() => {
    if (companyId) {
      fetchReviews();
      fetchStats();
    }
  }, [companyId]);

  useEffect(() => {
    if (refreshTrigger) {
      fetchReviews();
      fetchStats();
    }
  }, [refreshTrigger]);

  return {
    reviews,
    stats,
    loading,
    error,
    hasMore,
    currentSlide,
    loadMore,
    goPrev,
    goNext,
    retry,
  };
}
