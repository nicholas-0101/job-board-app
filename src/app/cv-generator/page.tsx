"use client";

import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";
import { useCVGenerator } from "@/components/cv-generator/useCVGenerator";
import SubscriptionGuard from "@/components/subscription/SubscriptionGuard";
import CVForm from "@/components/cv-generator/CVForm";
import MyCVsList from "@/components/cv-generator/MyCVsList";

// Helper component for tab navigation (max 15 lines)
const TabNavigation = ({ activeTab, setActiveTab }: { 
  activeTab: string; 
  setActiveTab: (tab: any) => void; 
}) => (
  <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8">
    <Button
      variant={activeTab === 'generate' ? 'default' : 'ghost'}
      onClick={() => setActiveTab('generate')}
      className={`flex-1 ${activeTab === 'generate' ? 'bg-[#467EC7] text-white' : ''}`}
    >
      <Plus className="w-4 h-4 mr-2" />
      Create CV
    </Button>
    <Button
      variant={activeTab === 'my-cvs' ? 'default' : 'ghost'}
      onClick={() => setActiveTab('my-cvs')}
      className={`flex-1 ${activeTab === 'my-cvs' ? 'bg-[#467EC7] text-white' : ''}`}
    >
      <FileText className="w-4 h-4 mr-2" />
      My CVs
    </Button>
  </div>
);

export default function CVGeneratorPage() {
  const {
    generatedCVs,
    isGenerating,
    isLoading,
    activeTab,
    formData,
    setActiveTab,
    handleInputChange,
    handleGenerateCV,
    handleDownloadCV,
    handleDeleteCV,
  } = useCVGenerator();

  return (
    <SubscriptionGuard feature="CV Generator">
      <div className="min-h-screen bg-[#F0F5F9] py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">CV Generator</h1>
            <p className="text-xl text-gray-600">
              Create professional, ATS-friendly CVs with our easy-to-use generator.
            </p>
          </div>

          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#467EC7] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          )}

          {!isLoading && (
            <>
              <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

              {activeTab === 'generate' && (
                <CVForm
                  formData={formData}
                  onInputChange={handleInputChange}
                  onGenerateCV={handleGenerateCV}
                  isGenerating={isGenerating}
                />
              )}

              {activeTab === 'my-cvs' && (
                <MyCVsList
                  generatedCVs={generatedCVs}
                  onDownloadCV={handleDownloadCV}
                  onDeleteCV={handleDeleteCV}
                  onSwitchToGenerate={() => setActiveTab('generate')}
                />
              )}
            </>
          )}
        </div>
      </div>
    </SubscriptionGuard>
  );
}
