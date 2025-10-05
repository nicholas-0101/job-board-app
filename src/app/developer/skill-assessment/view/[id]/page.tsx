"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import DeveloperAuthGuard from "@/components/auth/DeveloperAuthGuard";
import DeveloperLayout from "../../../components/DeveloperLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, Users, TrendingUp, Loader2 } from "lucide-react";
import { getAssessmentWithResults } from "@/lib/skillAssessment";
import toast from "react-hot-toast";

interface AssessmentResult {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  score: number;
  isPassed: boolean;
  finishedAt: string;
}

interface AssessmentDetail {
  id: number;
  title: string;
  description?: string;
  questionCount: number;
  results: AssessmentResult[];
}

export default function ViewAssessmentPage() {
  const router = useRouter();
  const params = useParams();
  const assessmentId = params.id as string;
  
  const [assessment, setAssessment] = useState<AssessmentDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssessmentResults();
  }, [assessmentId]);

  const fetchAssessmentResults = async () => {
    setLoading(true);
    try {
      const response = await getAssessmentWithResults(parseInt(assessmentId));
      const { assessment: assessmentData, results } = response;
      
      if (assessmentData) {
        setAssessment({
          id: assessmentData.id,
          title: assessmentData.title,
          description: assessmentData.description,
          questionCount: assessmentData._count?.questions || assessmentData.questions?.length || 0,
          results: Array.isArray(results) ? results.map((r: any) => ({
            id: r.id || Math.random(),
            userId: r.userId || 0,
            userName: r.user?.name || r.userName || "Unknown User",
            userEmail: r.user?.email || r.userEmail || "No email",
            score: r.score || 0,
            isPassed: r.isPassed || false,
            finishedAt: r.finishedAt || r.createdAt || new Date().toISOString(),
          })) : [],
        });
      } else {
        toast.error("Assessment not found");
      }
    } catch (error: any) {
      console.error("Error fetching results:", error);
      toast.error("Failed to load assessment results");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const passedCount = assessment?.results?.filter(r => r.isPassed).length || 0;
  const totalAttempts = assessment?.results?.length || 0;
  const passRate = totalAttempts > 0 ? Math.round((passedCount / totalAttempts) * 100) : 0;
  const avgScore = totalAttempts > 0 
    ? Math.round(assessment!.results.reduce((sum, r) => sum + r.score, 0) / totalAttempts)
    : 0;

  return (
    <DeveloperAuthGuard>
      <DeveloperLayout>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200/50 rounded-lg">
            <div className="px-6 py-8">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              {loading ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="h-6 w-6 animate-spin text-[#467EC7]" />
                  <span>Loading...</span>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-[#467EC7]">
                    {assessment?.title || "Assessment Details"}
                  </h1>
                  {assessment?.description && (
                    <p className="text-lg text-gray-600 mt-2">
                      {assessment.description}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#467EC7]" />
            </div>
          ) : assessment ? (
            <>
              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-3xl font-bold text-blue-900">
                        {assessment.questionCount || 0}
                      </p>
                      <p className="text-sm text-gray-600">Questions</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="text-3xl font-bold text-green-900">{totalAttempts}</p>
                      <p className="text-sm text-gray-600">Total Attempts</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-3xl font-bold text-purple-900">{passRate}%</p>
                      <p className="text-sm text-gray-600">Pass Rate</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                      <p className="text-3xl font-bold text-orange-900">{avgScore}</p>
                      <p className="text-sm text-gray-600">Avg Score</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Results Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Assessment Results ({totalAttempts})</CardTitle>
                </CardHeader>
                <CardContent>
                  {totalAttempts === 0 ? (
                    <div className="text-center py-12">
                      <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No attempts yet</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-3">User</th>
                            <th className="text-left p-3">Email</th>
                            <th className="text-center p-3">Score</th>
                            <th className="text-center p-3">Status</th>
                            <th className="text-left p-3">Finished At</th>
                          </tr>
                        </thead>
                        <tbody>
                          {assessment.results.map((result) => (
                            <tr key={result.id} className="border-b hover:bg-gray-50">
                              <td className="p-3">{result.userName}</td>
                              <td className="p-3 text-gray-600">{result.userEmail}</td>
                              <td className="p-3 text-center font-semibold">{result.score}</td>
                              <td className="p-3 text-center">
                                <Badge variant={result.isPassed ? "default" : "destructive"}>
                                  {result.isPassed ? "Passed" : "Failed"}
                                </Badge>
                              </td>
                              <td className="p-3 text-gray-600">
                                {formatDate(result.finishedAt)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500">Assessment not found</p>
              </CardContent>
            </Card>
          )}
        </div>
      </DeveloperLayout>
    </DeveloperAuthGuard>
  );
}
