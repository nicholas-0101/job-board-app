"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Plus, LogIn, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCVGenerator } from "@/components/cv-generator/useCVGenerator";
import SubscriptionWarning from "@/components/cv-generator/SubscriptionWarning";
import CVForm from "@/components/cv-generator/CVForm";
import MyCVsList from "@/components/cv-generator/MyCVsList";

export default function CVGeneratorPage() {
  const router = useRouter();
  const {
    generatedCVs,
    isGenerating,
    isLoading,
    activeTab,
    hasSubscription,
    isAuthenticated,
    formData,
    setActiveTab,
    handleInputChange,
    handleGenerateCV,
    handleDownloadCV,
    handleDeleteCV,
    checkSubscriptionAndLoadData,
  } = useCVGenerator();

  // Show auth warning if not authenticated
  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-[#F0F5F9] py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              CV Generator
            </h1>
            <p className="text-xl text-gray-600">
              Create professional, ATS-friendly CVs with our easy-to-use
              generator.
            </p>
          </div>

          <Card className="border-[#467EC7]/20 bg-[#467EC7]/5">
            <CardContent className="p-8">
              <div className="text-center">
                <AlertCircle className="w-16 h-16 text-[#467EC7] mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-[#467EC7] mb-4">
                  Authentication Required
                </h2>
                <p className="text-gray-700 mb-6 text-lg">
                  You need to sign in to access the CV Generator feature. Please
                  log in to your account to continue.
                </p>
                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={() => router.push("/signin")}
                    className="bg-[#467EC7] hover:bg-[#467EC7]/90 px-8 py-3 text-lg"
                  >
                    <LogIn className="w-5 h-5 mr-2" />
                    Sign In
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => router.push('/signup')}
                    className="px-8 py-3 text-lg"
                  >
                    Create Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F0F5F9] py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#467EC7] mx-auto mb-4"></div>
              <p className="text-gray-600">
                {isAuthenticated === null
                  ? "Checking authentication..."
                  : "Loading CV Generator..."}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F5F9] py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            CV Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create professional, ATS-friendly CVs with our easy-to-use
            generator. Optimized template designed for Applicant Tracking
            Systems.
          </p>
        </div>

        {/* Tab Navigation - Only show if has subscription */}
        {hasSubscription === true && (
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg p-1 shadow-sm border">
              <button
                onClick={() => setActiveTab("generate")}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  activeTab === "generate"
                    ? "bg-[#467EC7] text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Plus className="w-4 h-4 inline mr-2" />
                Generate New CV
              </button>
              <button
                onClick={() => setActiveTab("my-cvs")}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  activeTab === "my-cvs"
                    ? "bg-[#467EC7] text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <FileText className="w-4 h-4 inline mr-2" />
                My CVs ({generatedCVs.length})
              </button>
            </div>
          </div>
        )}

        {/* Subscription Required Warning */}
        {hasSubscription === false && (
          <SubscriptionWarning onCheckAgain={checkSubscriptionAndLoadData} />
        )}

        {/* Generate CV Tab - Only show if has subscription */}
        {hasSubscription === true && activeTab === "generate" && (
          <CVForm
            formData={formData}
            isGenerating={isGenerating}
            onInputChange={handleInputChange}
            onGenerateCV={handleGenerateCV}
          />
        )}

        {/* My CVs Tab - Only show if has subscription */}
        {hasSubscription === true && activeTab === "my-cvs" && (
          <MyCVsList
            generatedCVs={generatedCVs}
            onDownloadCV={handleDownloadCV}
            onDeleteCV={handleDeleteCV}
            onSwitchToGenerate={() => setActiveTab("generate")}
          />
        )}
      </div>
    </div>
  );
}
