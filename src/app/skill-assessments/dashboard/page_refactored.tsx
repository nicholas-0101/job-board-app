"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDashboardState } from "./hooks/useDashboardState";
import DashboardHeader from "./components/DashboardHeader";
import DashboardStats from "./components/DashboardStats";
import ResultsList from "./components/ResultsList";

export default function SkillAssessmentDashboard() {
  const router = useRouter();
  
  const {
    results,
    loading,
    fetchResults,
    getScoreColor,
    getPerformanceLevel,
  } = useDashboardState();

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const handleViewResult = (resultId: number) => {
    router.push(`/skill-assessments/results/${resultId}`);
  };

  const handleDownloadCertificate = (certificateUrl: string) => {
    window.open(certificateUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F0F5F9] to-[#E1F1F3] py-8">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F5F9] to-[#E1F1F3] py-8">
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
