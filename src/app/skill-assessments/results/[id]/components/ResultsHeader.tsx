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
  getScoreColor: (score: number) => string;
  getPerformanceLevel: (score: number) => string;
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
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {result.assessment.title}
            </h1>
            {result.assessment.description && (
              <p className="text-gray-600 mb-4">{result.assessment.description}</p>
            )}
            <p className="text-sm text-gray-500">
              Created by {result.assessment.creator.name}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {result.isPassed ? (
              <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1">
                <CheckCircle className="w-4 h-4 mr-2" />
                Passed
              </Badge>
            ) : (
              <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200 px-3 py-1">
                <XCircle className="w-4 h-4 mr-2" />
                Failed
              </Badge>
            )}

            {result.assessment.badgeTemplate && result.isPassed && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200 px-3 py-1">
                <Trophy className="w-4 h-4 mr-2" />
                Certificate Earned
              </Badge>
            )}
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Final Score</p>
              <p className={`text-3xl font-bold ${getScoreColor(result.score)}`}>
                {result.score}%
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Performance Level</p>
              <p className={`text-lg font-semibold ${getScoreColor(result.score)}`}>
                {getPerformanceLevel(result.score)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
