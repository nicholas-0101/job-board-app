import { useState, useCallback } from "react";
import { getUserResults } from "@/lib/skillAssessment";
import toast from "react-hot-toast";
import { Badge } from "../types";

export function useBadgeState() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBadges = useCallback(async () => {
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
      
      // Transform assessment results to badges
      const badgeData = resultsData.map((result: any) => ({
        id: result.assessment.badgeTemplate?.id || result.assessment.id,
        name: result.assessment.badgeTemplate?.name || `${result.assessment.title} Badge`,
        icon: result.assessment.badgeTemplate?.icon || "🏆",
        category: result.assessment.badgeTemplate?.category || "Skill Assessment",
        description: result.assessment.description || `Badge earned for completing ${result.assessment.title}`,
        assessmentId: result.assessment.id,
        assessmentTitle: result.assessment.title,
        earned: result.isPassed,
        earnedAt: result.isPassed ? result.finishedAt : undefined,
        score: result.score,
        certificateUrl: result.certificateUrl,
        certificateCode: result.certificateCode
      }));
      
      setBadges(badgeData);
    } catch (error: any) {
      toast.error("Failed to load badges");
      setBadges([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const getTotalBadges = useCallback(() => {
    return badges.length;
  }, [badges]);

  const getPassedBadges = useCallback(() => {
    return badges.filter(badge => badge.earned).length;
  }, [badges]);

  const getBadgesByCategory = useCallback(() => {
    const categories = badges.reduce((acc, badge) => {
      const category = badge.category || 'Other';
      if (!acc[category]) {
        acc[category] = { total: 0, earned: 0 };
      }
      acc[category].total++;
      if (badge.earned) {
        acc[category].earned++;
      }
      return acc;
    }, {} as Record<string, { total: number; earned: number }>);
    
    return categories;
  }, [badges]);

  return {
    badges,
    loading,
    fetchBadges,
    getTotalBadges,
    getPassedBadges,
    getBadgesByCategory,
  };
}
