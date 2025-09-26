"use client";
import DeveloperAuthGuard from "@/components/auth/DeveloperAuthGuard";
import DeveloperLayout from "../components/DeveloperLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Layout } from "lucide-react";
import { useState } from "react";
import { CVTemplate, GeneratedCV } from "./types";
import { mockTemplates, mockGeneratedCVs } from "./mockData";
import CVGeneratorStats from "./components/CVGeneratorStats";
import TemplateCard from "./components/TemplateCard";
import GeneratedCVCard from "./components/GeneratedCVCard";

export default function CVGeneratorPage() {
  const [templates, setTemplates] = useState<CVTemplate[]>(mockTemplates);
  const [generatedCVs, setGeneratedCVs] = useState<GeneratedCV[]>(mockGeneratedCVs);
  const [activeTab, setActiveTab] = useState<"templates" | "generated">("templates");

  const handleEditTemplate = (template: CVTemplate) => {
    // TODO: Implement edit functionality
    console.log("Edit template:", template);
  };

  const handleDeleteTemplate = (templateId: number) => {
    // TODO: Implement delete functionality
    console.log("Delete template:", templateId);
  };

  const handleViewTemplate = (template: CVTemplate) => {
    // TODO: Implement view functionality
    console.log("View template:", template);
  };

  const handleDownloadCV = (cv: GeneratedCV) => {
    // TODO: Implement download functionality
    console.log("Download CV:", cv);
  };

  const handleViewCV = (cv: GeneratedCV) => {
    // TODO: Implement view functionality
    console.log("View CV:", cv);
  };

  const handleDeleteCV = (cvId: number) => {
    // TODO: Implement delete functionality
    console.log("Delete CV:", cvId);
  };

  return (
    <DeveloperAuthGuard>
      <DeveloperLayout>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200/50 rounded-lg">
            <div className="px-6 py-8">
              <div className="flex items-start sm:items-center justify-between gap-3 flex-col sm:flex-row">
                <div className="w-full sm:w-auto text-center sm:text-left">
                  <h1 className="text-3xl font-bold text-[#467EC7]">
                    CV Generator Management
                  </h1>
                  <p className="text-lg text-gray-600 mt-2">
                    Manage CV templates and monitor generated CVs
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button className="bg-[#467EC7] hover:bg-[#467EC7]/90">
                    <Plus className="w-4 h-4 mr-1" />
                    Create Template
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <CVGeneratorStats templates={templates} generatedCVs={generatedCVs} />

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab("templates")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "templates"
                  ? "bg-white text-[#467EC7] shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              CV Templates ({templates.length})
            </button>
            <button
              onClick={() => setActiveTab("generated")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "generated"
                  ? "bg-white text-[#467EC7] shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Generated CVs ({generatedCVs.length})
            </button>
          </div>

          {/* Content */}
          {activeTab === "templates" ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Layout className="h-5 w-5" />
                  <span>CV Templates</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {templates.length === 0 ? (
                  <div className="text-center py-12">
                    <Layout className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Templates Yet</h3>
                    <p className="text-gray-500 mb-4">Create your first CV template to get started.</p>
                    <Button className="bg-[#467EC7] hover:bg-[#467EC7]/90">
                      <Plus className="w-4 h-4 mr-1" />
                      Create Template
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map((template) => (
                      <TemplateCard
                        key={template.id}
                        template={template}
                        onEdit={handleEditTemplate}
                        onDelete={handleDeleteTemplate}
                        onView={handleViewTemplate}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Generated CVs</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {generatedCVs.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No CVs Generated Yet</h3>
                    <p className="text-gray-500">Generated CVs will appear here when users create them.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {generatedCVs.map((cv) => (
                      <GeneratedCVCard
                        key={cv.id}
                        cv={cv}
                        onDownload={handleDownloadCV}
                        onView={handleViewCV}
                        onDelete={handleDeleteCV}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </DeveloperLayout>
    </DeveloperAuthGuard>
  );
}
