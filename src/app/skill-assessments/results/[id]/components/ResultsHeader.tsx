"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, XCircle, Trophy } from "lucide-react";

interface AssessmentResult {
  score: number;
  isPassed: boolean;
  assessment: {
    title: string;
    description?: string;
    passScore?: number;
    badgeTemplate?: {
      name: string;
      category?: string;
    };
    creator: {
      name: string;
    };
  };
}

interface ResultsHeaderProps {
  result: AssessmentResult;
  getScoreColor: (score: number, passScore?: number) => string;
  getPerformanceLevel: (score: number, passScore?: number) => string;
  onBack: () => void;
}

export default function ResultsHeader({
  result,
  getScoreColor,
  getPerformanceLevel,
  onBack,
}: ResultsHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2 px-2 sm:px-3">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              {result.assessment.title}
            </h1>
            {result.assessment.description && (
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">{result.assessment.description}</p>
            )}
            <p className="text-xs sm:text-sm text-gray-500">
              Created by {result.assessment.creator.name}
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {result.isPassed ? (
              <Badge className="bg-[#24CFA7]/10 text-[#24CFA7] border-[#24CFA7]/20 px-3 py-1">
                <CheckCircle className="w-4 h-4 mr-2" />
                Passed
              </Badge>
            ) : (
              <Badge variant="destructive" className="bg-red-50 text-red-600 border-red-200 px-3 py-1">
                <XCircle className="w-4 h-4 mr-2" />
                Failed
              </Badge>
            )}

            {result.assessment.badgeTemplate && result.isPassed && (
              <Badge variant="secondary" className="bg-[#467EC7]/10 text-[#467EC7] border-[#467EC7]/20 px-3 py-1">
                <Trophy className="w-4 h-4 mr-2" />
                Certificate Earned
              </Badge>
            )}
          </div>
        </div>

        <div className="pt-3 sm:pt-4 border-t">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Final Score</p>
              <p className={`text-2xl sm:text-3xl font-bold ${getScoreColor(result.score, result.assessment.passScore)}`}>
                {result.score}%
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs sm:text-sm text-gray-600">Performance Level</p>
              <p className={`text-base sm:text-lg font-semibold ${getScoreColor(result.score, result.assessment.passScore)}`}>
                {getPerformanceLevel(result.score, result.assessment.passScore)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
