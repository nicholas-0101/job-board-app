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

  const categories = ["all", ...Array.from(new Set(assessments.map(a => a.category).filter(Boolean)))];
  
  const filteredAssessments = selectedCategory === "all" 
    ? assessments 
    : assessments.filter(a => a.category === selectedCategory);

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
                    Skill Assessment Management
                  </h1>
                  <p className="text-lg text-gray-600 mt-2">
                    Create and manage skill assessment tests for job candidates
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    className="bg-[#467EC7] hover:bg-[#467EC7]/90"
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
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#467EC7]">{assessments.length}</p>
                  <p className="text-sm text-gray-600">Total Assessments</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#24CFA7]">
                    {assessments.reduce((sum, a) => sum + (a.attemptCount || 0), 0)}
                  </p>
                  <p className="text-sm text-gray-600">Total Attempts</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">
                    {assessments.length > 0 
                      ? Math.round(assessments.reduce((sum, a) => sum + (a.passRate || 0), 0) / assessments.length)
                      : 0}%
                  </p>
                  <p className="text-sm text-gray-600">Average Pass Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Filter */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Filter by Category</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className="cursor-pointer capitalize"
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
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Skill Assessments ({filteredAssessments.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-[#467EC7]" />
                </div>
              ) : filteredAssessments.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {selectedCategory === "all" ? "No Assessments Yet" : "No Assessments in This Category"}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {selectedCategory === "all" 
                      ? "Create your first skill assessment to get started." 
                      : `No assessments found in ${selectedCategory} category.`
                    }
                  </p>
                  {selectedCategory === "all" && (
                    <Button 
                      className="bg-[#467EC7] hover:bg-[#467EC7]/90"
                      onClick={handleCreateAssessment}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Create Assessment
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
