"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAssessments } from "@/lib/skillAssessment";
import { useSubscription } from "@/hooks/useSubscription";
import SubscriptionGuard from "@/components/skill-assessments/SubscriptionGuard";
import AssessmentCard from "@/components/skill-assessments/AssessmentCard";
import AssessmentStats from "@/components/skill-assessments/AssessmentStats";
import AssessmentFilters from "@/components/skill-assessments/AssessmentFilters";
import { Assessment, AssessmentStats as StatsType, AssessmentFilters as FiltersType } from "@/types/skillAssessment";
import toast from "react-hot-toast";

// Helper functions (max 15 lines each)
const filterAssessments = (assessments: Assessment[], filters: FiltersType, searchQuery: string) => {
  let filtered = assessments;
  
  if (filters.category !== "all") {
    filtered = filtered.filter(a => a.badgeTemplate?.name === filters.category);
  }
  
  if (searchQuery) {
    filtered = filtered.filter(a => 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  return filtered;
};

const sortAssessments = (assessments: Assessment[], sortBy: string) => {
  switch (sortBy) {
    case "title":
      return [...assessments].sort((a, b) => a.title.localeCompare(b.title));
    default:
      return assessments;
  }
};

const calculateStats = (assessments: Assessment[]): StatsType => {
  const totalParticipants = assessments.reduce((sum, a) => sum + a._count.results, 0);
  
  return {
    totalAssessments: assessments.length,
    totalParticipants
  };
};

const extractUniqueCategories = (assessments: Assessment[]) => {
  const uniqueBadges = new Set<string>();
  
  assessments.forEach(assessment => {
    if (assessment.badgeTemplate?.name) {
      uniqueBadges.add(assessment.badgeTemplate.name);
    }
  });
  
  return [
    { value: "all", label: "All Categories" },
    ...Array.from(uniqueBadges).sort().map(badge => ({
      value: badge,
      label: badge
    }))
  ];
};

const LoadingState = () => (
  <div className="min-h-screen bg-[#F0F5F9] py-8">
    <div className="max-w-6xl mx-auto px-4">
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default function SkillAssessmentsPage() {
  const router = useRouter();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FiltersType>({
    category: "all",
    sortBy: "title"
  });
  
  const { hasSubscription, isLoading: subscriptionLoading, isAuthenticated } = useSubscription();

  useEffect(() => {
    if (hasSubscription === true) {
      fetchAssessments();
    }
  }, [hasSubscription]);

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const response = await getAssessments(1, 50); // Get more assessments for filtering
      
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

  // Show loading state
  if (subscriptionLoading || (hasSubscription === true && loading)) {
    return <LoadingState />;
  }

  // Show subscription guard if needed
  if (isAuthenticated === false || hasSubscription === false) {
    return (
      <SubscriptionGuard 
        hasSubscription={hasSubscription}
        isAuthenticated={isAuthenticated}
        onUpgrade={() => router.push("/subscription")}
        onSignIn={() => router.push("/signin")}
      />
    );
  }

  // Filter and sort assessments
  const filteredAssessments = filterAssessments(assessments, filters, searchQuery);
  const sortedAssessments = sortAssessments(filteredAssessments, filters.sortBy);
  const stats = calculateStats(assessments);
  const categories = extractUniqueCategories(assessments);

  return (
    <div className="min-h-screen bg-[#F0F5F9] py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Skill Assessments
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Test your skills with our comprehensive assessments. 
            Pass with 75% to earn certificates and badges for your profile.
          </p>
        </div>

        {/* Stats */}
        <AssessmentStats stats={stats} />

        {/* Filters */}
        <AssessmentFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onSearch={handleSearch}
          categories={categories}
        />

        {/* Assessments Grid */}
        {sortedAssessments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchQuery || filters.category !== "all" 
                ? "No assessments found matching your criteria." 
                : "No assessments available at the moment."
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedAssessments.map((assessment) => (
              <AssessmentCard
                key={assessment.id}
                assessment={assessment}
                onTakeAssessment={handleTakeAssessment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
