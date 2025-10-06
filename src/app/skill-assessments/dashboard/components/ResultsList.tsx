"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Download, Eye, Trophy, Calendar } from "lucide-react";

interface AssessmentResult {
  id: number;
  assessmentId: number;
  score: number;
  isPassed: boolean;
  certificateUrl?: string;
  certificateCode?: string;
  startedAt: string;
  finishedAt: string;
  assessment: {
    id: number;
    title: string;
    description?: string;
    badgeTemplate?: {
      id: number;
      name: string;
      icon?: string;
      category?: string;
    };
    creator: {
      name: string;
    };
  };
}

interface ResultsListProps {
  results: AssessmentResult[];
  getScoreColor: (score: number) => string;
  getPerformanceLevel: (score: number) => string;
  onViewResult: (resultId: number) => void;
  onDownloadCertificate: (certificateUrl: string) => void;
}

export default function ResultsList({
  results,
  getScoreColor,
  getPerformanceLevel,
  onViewResult,
  onDownloadCertificate,
}: ResultsListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Assessment Results
          </h3>
          <p className="text-gray-600">
            You haven't completed any assessments yet. Start taking assessments to see your results here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {results.map((result) => (
        <Card key={result.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg mb-2">
                  {result.assessment?.title || 'Unknown Assessment'}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>Completed on {formatDate(result.finishedAt)}</span>
                </div>
                <p className="text-sm text-gray-600">
                  Created by {result.assessment?.creator?.name || 'Unknown Creator'}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                {result.isPassed ? (
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Passed
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
                    <XCircle className="w-3 h-3 mr-1" />
                    Failed
                  </Badge>
                )}
                
                {result.assessment?.badgeTemplate && result.isPassed && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    <Trophy className="w-3 h-3 mr-1" />
                    Certificate
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              {/* Score Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Score</span>
                  <span className={`text-sm font-bold ${getScoreColor(result.score)}`}>
                    {result.score}% - {getPerformanceLevel(result.score)}
                  </span>
                </div>
                <Progress value={result.score} className="h-2" />
              </div>

              {/* Certificate Info */}
              {result.assessment?.badgeTemplate && result.isPassed && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">
                      Certificate: {result.assessment?.badgeTemplate?.name || 'Certificate Available'}
                    </span>
                  </div>
                  {result.certificateCode && (
                    <p className="text-xs text-yellow-700">
                      Certificate Code: {result.certificateCode}
                    </p>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewResult(result.id)}
                  className="flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </Button>
                
                {result.certificateUrl && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => onDownloadCertificate(result.certificateUrl!)}
                    className="flex items-center gap-2 bg-[#467EC7] hover:bg-[#467EC7]/90"
                  >
                    <Download className="w-4 h-4" />
                    Download Certificate
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
