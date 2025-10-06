import { useState, useCallback } from "react";
import { getUserResults } from "@/lib/skillAssessment";
import toast from "react-hot-toast";

interface AssessmentResult {
  id: number;
  userId: number;
  assessmentId: number;
  score: number;
  isPassed: boolean;
  certificateUrl?: string;
  certificateCode?: string;
  startedAt: string;
  finishedAt: string;
  createdAt: string;
  assessment: {
    id: number;
    title: string;
    description?: string;
    badgeTemplate?: {
      id: number;
      name: string;
      icon?: string;
      category?: string;
    };
    creator: {
      id: number;
      name: string;
    };
  };
}

export function useDashboardState() {
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResults = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getUserResults();
      
      let resultsData = [];
      if (response.data?.results && Array.isArray(response.data.results)) {
        resultsData = response.data.results;
      } else if (Array.isArray(response.data)) {
        resultsData = response.data;
      } else if (Array.isArray(response)) {
        resultsData = response;
      }
      
      setResults(resultsData);
    } catch (error: any) {
      toast.error("Failed to load assessment results");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const getScoreColor = useCallback((score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-blue-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  }, []);

  const getPerformanceLevel = useCallback((score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 75) return "Good";
    if (score >= 60) return "Fair";
    return "Needs Improvement";
  }, []);

  return {
    results,
    loading,
    fetchResults,
    getScoreColor,
    getPerformanceLevel,
  };
}
