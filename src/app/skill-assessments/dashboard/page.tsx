"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDashboardState } from "./hooks/useDashboardState";
import { useSubscription } from "@/hooks/useSubscription";
import DashboardHeader from "./components/DashboardHeader";
import DashboardStats from "./components/DashboardStats";
import ResultsList from "./components/ResultsList";
import SubscriptionGuard from "@/components/skill-assessments/SubscriptionGuard";

export default function SkillAssessmentDashboard() {
  const router = useRouter();
  const { hasSubscription, isLoading: subscriptionLoading, isAuthenticated } = useSubscription();
  
  const {
    results,
    loading,
    fetchResults,
    getScoreColor,
    getPerformanceLevel,
  } = useDashboardState();

  useEffect(() => {
    // Only fetch results if user has subscription
    if (hasSubscription === true) {
      fetchResults();
    }
  }, [fetchResults, hasSubscription]);

  const handleViewResult = (resultId: number) => {
    router.push(`/skill-assessments/results/${resultId}`);
  };

  const handleDownloadCertificate = (certificateUrl: string) => {
    window.open(certificateUrl, '_blank');
  };

  // Show loading state while checking subscription
  if (subscriptionLoading || (hasSubscription === true && loading)) {
    return (
      <div className="min-h-screen bg-[#F0F5F9] py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show subscription guard if not authenticated or no subscription
  if (isAuthenticated === false || hasSubscription === false) {
    return (
      <SubscriptionGuard 
        hasSubscription={hasSubscription}
        isAuthenticated={isAuthenticated}
        onUpgrade={() => router.push('/subscription')}
        onSignIn={() => router.push('/go-to-signin')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F5F9] py-8">
      <div className="max-w-6xl mx-auto px-4">
        <DashboardHeader />
        
        <DashboardStats results={results} />
        
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Assessment Results
          </h2>
        </div>
        
        <ResultsList
          results={results}
          getScoreColor={getScoreColor}
          getPerformanceLevel={getPerformanceLevel}
          onViewResult={handleViewResult}
          onDownloadCertificate={handleDownloadCertificate}
        />
      </div>
    </div>
  );
}
