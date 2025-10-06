"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Target, Star } from "lucide-react";

interface AssessmentResult {
  score: number;
  startedAt: string;
  finishedAt: string;
  createdAt: string;
}

interface ResultsDetailsProps {
  result: AssessmentResult;
  getScoreColor: (score: number) => string;
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

  const getScoreDescription = (score: number) => {
    if (score >= 90) {
      return "Outstanding performance! You have excellent mastery of the subject matter.";
    } else if (score >= 75) {
      return "Good job! You have a solid understanding of the concepts.";
    } else if (score >= 60) {
      return "Fair performance. Consider reviewing the material to improve your understanding.";
    } else {
      return "You may want to study more and retake the assessment to improve your score.";
    }
  };

  const getRecommendations = (score: number) => {
    if (score >= 90) {
      return [
        "Consider taking advanced assessments in related topics",
        "Share your knowledge by mentoring others",
        "Apply your skills to real-world projects"
      ];
    } else if (score >= 75) {
      return [
        "Review areas where you scored lower",
        "Practice with additional exercises",
        "Consider taking related assessments"
      ];
    } else if (score >= 60) {
      return [
        "Focus on fundamental concepts",
        "Seek additional learning resources",
        "Consider retaking the assessment after more study"
      ];
    } else {
      return [
        "Review all course materials thoroughly",
        "Seek help from instructors or peers",
        "Practice with basic exercises before retaking"
      ];
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              <span className={`text-sm font-bold ${getScoreColor(result.score)}`}>
                {result.score}%
              </span>
            </div>
            <Progress value={result.score} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Performance Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Performance Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Assessment Feedback</p>
            <p className="text-sm text-gray-800 leading-relaxed">
              {getScoreDescription(result.score)}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-2">Recommendations</p>
            <ul className="space-y-1">
              {getRecommendations(result.score).map((recommendation, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-[#467EC7] mt-1">•</span>
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
