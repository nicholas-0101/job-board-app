import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getUserResults } from "@/lib/skillAssessment";
import toast from "react-hot-toast";

interface AssessmentResult {
  id: number;
  userId: number;
  assessmentId: number;
  assessmentSlug?: string;
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
    passScore?: number;
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

export function useResultsState(idOrSlug: string) {
  const router = useRouter();
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchResult = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getUserResults();

      let resultsData: any[] = [];
      if (response.data?.results && Array.isArray(response.data.results)) {
        resultsData = response.data.results;
      } else if (Array.isArray(response.data)) {
        resultsData = response.data;
      } else if (Array.isArray(response)) {
        resultsData = response;
      }

      const foundResult = resultsData.find((r: any) => {
        if (/^\d+$/.test(idOrSlug)) return r.id === parseInt(idOrSlug);
        return r.slug === idOrSlug || r.certificateCode === idOrSlug;
      });
      if (!foundResult) {
        toast.error("Assessment result not found");
        router.push("/skill-assessments/dashboard");
        return;
      }

      setResult(foundResult);
    } catch (error: any) {
      toast.error("Failed to load assessment result");
      router.push("/skill-assessments/dashboard");
    } finally {
      setLoading(false);
    }
  }, [idOrSlug, router]);

  const getScoreColor = useCallback((score: number, passScore?: number) => {
    const threshold = passScore || 75;
    if (score >= 90) return "text-[#24CFA7]";
    if (score >= threshold) return "text-[#467EC7]";
    if (score >= Math.max(60, threshold * 0.8)) return "text-orange-500";
    return "text-red-500";
  }, []);

  const getPerformanceLevel = useCallback(
    (score: number, passScore?: number) => {
      const threshold = passScore || 75;
      if (score >= 90) return "Excellent";
      if (score >= threshold) return "Good";
      if (score >= Math.max(60, threshold * 0.8)) return "Fair";
      return "Needs Improvement";
    },
    []
  );

  const calculateDuration = useCallback(
    (startedAt: string, finishedAt: string) => {
      const start = new Date(startedAt);
      const end = new Date(finishedAt);
      const diffMs = end.getTime() - start.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffSecs = Math.floor((diffMs % 60000) / 1000);
      return `${diffMins}m ${diffSecs}s`;
    },
    []
  );

  return {
    result,
    loading,
    fetchResult,
    getScoreColor,
    getPerformanceLevel,
    calculateDuration,
  };
}
