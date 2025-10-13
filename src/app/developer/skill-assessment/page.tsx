"use client";
import DeveloperAuthGuard from "@/components/auth/DeveloperAuthGuard";
import DeveloperLayout from "../components/DeveloperLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Filter, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AssessmentCardSimple from "./components/AssessmentCardSimple";
import { useAssessments, AssessmentData } from "./hooks/useAssessments";

export default function SkillAssessmentPage() {
  const router = useRouter();
  const { assessments, loading, deleteAssessment } = useAssessments();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const handleCreateAssessment = () => {
    router.push("/developer/skill-assessment/create");
  };

  const handleEditAssessment = (assessment: AssessmentData) => {
    // Navigate to edit page
    router.push(`/developer/skill-assessment/edit/${assessment.id}`);
  };

  const handleViewAssessment = (assessment: AssessmentData) => {
    // Navigate to view/results page
    router.push(`/developer/skill-assessment/view/${assessment.id}`);
  };

  const categories = [
    "all",
    ...Array.from(new Set(assessments.map((a) => a.category).filter(Boolean))),
  ];

  const filteredAssessments =
    selectedCategory === "all"
      ? assessments
      : assessments.filter((a) => a.category === selectedCategory);

  return (
    <DeveloperAuthGuard>
      <DeveloperLayout>
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200/50 rounded-lg">
            <div className="px-4 sm:px-6 py-6 sm:py-8">
              <div className="flex items-start sm:items-center justify-between gap-3 flex-col sm:flex-row">
                <div className="w-full sm:w-auto text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#467EC7]">
                    Skill Assessment Management
                  </h1>
                  <p className="text-base sm:text-lg text-gray-600 mt-2">
                    Create and manage skill assessment tests for job candidates
                  </p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    className="bg-[#467EC7] hover:bg-[#467EC7]/90 w-full sm:w-auto"
                    onClick={handleCreateAssessment}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Create Assessment
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <Card>
            <CardContent className="pt-4 sm:pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl sm:text-3xl font-bold text-[#467EC7]">
                    {assessments.length}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Total Assessments
                  </p>
                </div>
                <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl sm:text-3xl font-bold text-[#24CFA7]">
                    {assessments.reduce(
                      (sum, a) => sum + (a.attemptCount || 0),
                      0
                    )}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Total Attempts
                  </p>
                </div>
                <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl sm:text-3xl font-bold text-purple-600">
                    {assessments.length > 0
                      ? Math.round(
                          assessments.reduce(
                            (sum, a) => sum + (a.passRate || 0),
                            0
                          ) / assessments.length
                        )
                      : 0}
                    %
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Average Pass Rate
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Filter */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Filter by Category</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={
                      selectedCategory === category ? "default" : "outline"
                    }
                    className="cursor-pointer capitalize text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5"
                    onClick={() => setSelectedCategory(category || "all")}
                  >
                    {category === "all" ? "All Categories" : category}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Assessments List */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Skill Assessments ({filteredAssessments.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {loading ? (
                <div className="flex justify-center items-center py-8 sm:py-12">
                  <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-[#467EC7]" />
                </div>
              ) : filteredAssessments.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <FileText className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                    {selectedCategory === "all"
                      ? "No Assessments Yet"
                      : "No Assessments in This Category"}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-500 mb-4 px-4">
                    {selectedCategory === "all"
                      ? "Create your first skill assessment to get started."
                      : `No assessments found in ${selectedCategory} category.`}
                  </p>
                  {selectedCategory === "all" && (
                    <Button
                      className="bg-[#467EC7] hover:bg-[#467EC7]/90 w-full sm:w-auto"
                      onClick={handleCreateAssessment}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Create Assessment
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {filteredAssessments.map((assessment) => (
                    <AssessmentCardSimple
                      key={assessment.id}
                      assessment={assessment}
                      onEdit={handleEditAssessment}
                      onDelete={deleteAssessment}
                      onView={handleViewAssessment}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DeveloperLayout>
    </DeveloperAuthGuard>
  );
}
