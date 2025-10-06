"use client";
import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useResultsState } from "./hooks/useResultsState";
import ResultsHeader from "./components/ResultsHeader";
import ResultsDetails from "./components/ResultsDetails";
import CertificateSection from "./components/CertificateSection";
import toast from "react-hot-toast";

export default function AssessmentResultPage() {
  const router = useRouter();
  const params = useParams();
  const resultId = parseInt(params.id as string);
  
  const {
    result,
    loading,
    fetchResult,
    getScoreColor,
    getPerformanceLevel,
    calculateDuration,
  } = useResultsState(resultId);

  useEffect(() => {
    fetchResult();
  }, [fetchResult]);

  const handleBack = () => {
    router.push("/skill-assessments/dashboard");
  };

  const handleDownloadCertificate = (certificateUrl: string) => {
    window.open(certificateUrl, '_blank');
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F0F5F9] to-[#E1F1F3] py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-48 bg-gray-200 rounded-lg"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-64 bg-gray-200 rounded-lg"></div>
              <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F0F5F9] to-[#E1F1F3] py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Result not found</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F5F9] to-[#E1F1F3] py-8">
      <div className="max-w-4xl mx-auto px-4">
        <ResultsHeader
          result={result}
          getScoreColor={getScoreColor}
          getPerformanceLevel={getPerformanceLevel}
          onBack={handleBack}
        />
        
        <ResultsDetails
          result={result}
          getScoreColor={getScoreColor}
          calculateDuration={calculateDuration}
        />
        
        <CertificateSection
          result={result}
          onDownloadCertificate={handleDownloadCertificate}
        />
      </div>
    </div>
  );
}
