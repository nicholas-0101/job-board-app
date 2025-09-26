import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, Users, Clock, CheckCircle, FileText } from "lucide-react";
import { SkillAssessment } from "../types";

interface AssessmentCardProps {
  assessment: SkillAssessment;
  onEdit?: (assessment: SkillAssessment) => void;
  onDelete?: (assessmentId: number) => void;
  onView?: (assessment: SkillAssessment) => void;
}

export default function AssessmentCard({ assessment, onEdit, onDelete, onView }: AssessmentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "draft": return "bg-yellow-100 text-yellow-800";
      case "archived": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-blue-100 text-blue-800";
      case "Intermediate": return "bg-orange-100 text-orange-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Frontend Development": return "bg-purple-100 text-purple-800";
      case "Backend Development": return "bg-green-100 text-green-800";
      case "Database": return "bg-blue-100 text-blue-800";
      case "Programming": return "bg-indigo-100 text-indigo-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const successRate = assessment.participants > 0 
    ? Math.round((assessment.passedCount / assessment.participants) * 100) 
    : 0;

  return (
    <Card className="hover:shadow-lg transition-all duration-200 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-[#467EC7] to-[#24CFA7] rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">{assessment.title}</CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={getStatusColor(assessment.status)}>
                  {assessment.status}
                </Badge>
                <Badge variant="outline" className={getDifficultyColor(assessment.difficulty)}>
                  {assessment.difficulty}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onView && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onView(assessment)}
                className="h-8 w-8 p-0"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(assessment)}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(assessment.id)}
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          <Badge variant="outline" className={getCategoryColor(assessment.category)}>
            {assessment.category}
          </Badge>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <span>{assessment.questions} questions</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>{assessment.duration} minutes</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span>{assessment.participants} participants</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-gray-500" />
              <span>{successRate}% success rate</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="text-sm text-gray-500">
              Pass Rate: <span className="font-medium">{assessment.passRate}%</span>
            </div>
            <div className="text-sm text-gray-400">
              Created: {formatDate(assessment.createdAt)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
