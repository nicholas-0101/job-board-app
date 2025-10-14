"use client";
import { useRouter } from "next/navigation";
import SubscriptionGuard from "@/components/skill-assessments/SubscriptionGuard";
import DeveloperBlockGuard from "@/components/auth/DeveloperBlockGuard";
import AssessmentCard from "@/components/skill-assessments/AssessmentCard";
import AssessmentStats from "@/components/skill-assessments/AssessmentStats";
import AssessmentFilters from "@/components/skill-assessments/AssessmentFilters";
import LoadingState from "./components/LoadingState";
import { useAssessmentData } from "./hooks/useAssessmentData";
import {
  filterAssessments,
  sortAssessments,
  calculateStats,
  extractUniqueCategories,
} from "./utils/assessmentHelpers";

export default function SkillAssessmentsPage() {
  const router = useRouter();
  const {
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
  } = useAssessmentData();

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
  const filteredAssessments = filterAssessments(
    assessments,
    filters,
    searchQuery
  );
  const sortedAssessments = sortAssessments(
    filteredAssessments,
    filters.sortBy
  );
  const stats = calculateStats(assessments);
  const categories = extractUniqueCategories(assessments);

  return (
    <DeveloperBlockGuard>
      <div className="min-h-screen bg-[#F0F5F9] py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Skill Assessments
            </h1>
            <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">
              Test your skills with our comprehensive assessments. Each
              assessment has its own passing score to earn certificates and
              badges for your profile.
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
              <p className="text-gray-500 text-base sm:text-lg px-3">
                {searchQuery || filters.category !== "all"
                  ? "No assessments found matching your criteria."
                  : "No assessments available at the moment."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 auto-rows-fr">
              {sortedAssessments.map((assessment) => (
                <AssessmentCard
                  key={assessment.slug}
                  assessment={assessment}
                  onTakeAssessment={handleTakeAssessment}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </DeveloperBlockGuard>
  );
}
