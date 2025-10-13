import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, FileText, Users, TrendingUp } from "lucide-react";
import { AssessmentData } from "../hooks/useAssessments";

interface AssessmentCardProps {
  assessment: AssessmentData;
  onEdit?: (assessment: AssessmentData) => void;
  onDelete?: (assessmentId: number) => void;
  onView?: (assessment: AssessmentData) => void;
}

export default function AssessmentCardSimple({
  assessment,
  onEdit,
  onDelete,
  onView,
}: AssessmentCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#467EC7] to-[#24CFA7] rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base sm:text-lg font-semibold truncate">
                {assessment.title}
              </CardTitle>
              {assessment.category && (
                <Badge variant="outline" className="mt-1 text-xs">
                  {assessment.category}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-1 flex-shrink-0">
            {onView && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onView(assessment)}
                className="h-7 w-7 sm:h-8 sm:w-8 p-0"
              >
                <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            )}
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(assessment)}
                className="h-7 w-7 sm:h-8 sm:w-8 p-0"
              >
                <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(assessment.id)}
                className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3 sm:space-y-4">
          {assessment.description && (
            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
              {assessment.description}
            </p>
          )}

          {/* Statistics Grid - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <div className="min-w-0">
                <div className="font-semibold text-blue-900 text-sm">
                  {assessment.questionCount || 0}
                </div>
                <div className="text-xs text-gray-600">Questions</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <Users className="h-5 w-5 text-green-600 flex-shrink-0" />
              <div className="min-w-0">
                <div className="font-semibold text-green-900 text-sm">
                  {assessment.attemptCount || 0}
                </div>
                <div className="text-xs text-gray-600">Attempts</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600 flex-shrink-0" />
              <div className="min-w-0">
                <div className="font-semibold text-purple-900 text-sm">
                  {assessment.passRate || 0}%
                </div>
                <div className="text-xs text-gray-600">Pass Rate</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="text-xs text-gray-400">
              Created: {formatDate(assessment.createdAt)}
            </div>
            <Badge variant="secondary" className="text-xs">
              ID: {assessment.id}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
