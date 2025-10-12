import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAssessments } from "@/lib/skillAssessment";
import { useSubscription } from "@/hooks/useSubscription";
import {
  Assessment,
  AssessmentFilters as FiltersType,
} from "@/types/skillAssessment";
import toast from "react-hot-toast";

export const useAssessmentData = () => {
  const router = useRouter();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FiltersType>({
    category: "all",
    sortBy: "title",
  });

  const {
    hasSubscription,
    isLoading: subscriptionLoading,
    isAuthenticated,
  } = useSubscription();

  useEffect(() => {
    if (hasSubscription === true) {
      fetchAssessments();
    }
  }, [hasSubscription]);

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const response = await getAssessments(1, 50);

      if (response.data.assessments) {
        setAssessments(response.data.assessments);
      }
    } catch (error: any) {
      toast.error("Failed to load skill assessments");
    } finally {
      setLoading(false);
    }
  };

  const handleTakeAssessment = (assessmentId: number) => {
    router.push(`/skill-assessments/${assessmentId}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFiltersChange = (newFilters: FiltersType) => {
    setFilters(newFilters);
  };

  return {
    assessments,
    loading,
    searchQuery,
    filters,
    hasSubscription,
    subscriptionLoading,
    isAuthenticated,
    handleTakeAssessment,
    handleSearch,
    handleFiltersChange,
  };
};
