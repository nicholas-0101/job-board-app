"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Target } from "lucide-react";

interface AssessmentResult {
  score: number;
  startedAt: string;
  finishedAt: string;
  createdAt: string;
  assessment: {
    passScore?: number;
  };
}

interface ResultsDetailsProps {
  result: AssessmentResult;
  getScoreColor: (score: number, passScore?: number) => string;
  calculateDuration: (startedAt: string, finishedAt: string) => string;
}

export default function ResultsDetails({
  result,
  getScoreColor,
  calculateDuration,
}: ResultsDetailsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };


  return (
    <div className="mb-6">
      {/* Assessment Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Assessment Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Completed On</p>
              <p className="font-medium">{formatDate(result.finishedAt)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Duration</p>
              <p className="font-medium">{calculateDuration(result.startedAt, result.finishedAt)}</p>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Score Breakdown</span>
              <span className={`text-sm font-bold ${getScoreColor(result.score, result.assessment.passScore)}`}>
                {result.score}%
              </span>
            </div>
            <Progress value={result.score} className="h-3" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
