"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Award, 
  CheckCircle, 
  XCircle, 
  Download, 
  Eye,
  Trophy,
  Calendar,
  Target,
  TrendingUp,
  BookOpen
} from "lucide-react";
import { getUserResults } from "@/lib/skillAssessment";
import toast from "react-hot-toast";

interface AssessmentResult {
  id: number;
  userId: number;
  assessmentId: number;
  score: number;
  isPassed: boolean;
  certificateUrl?: string;
  certificateCode?: string;
  startedAt: string;
  finishedAt: string;
  createdAt: string;
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
      id: number;
      name: string;
    };
  };
}

export default function SkillAssessmentDashboard() {
  const router = useRouter();
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await getUserResults();
      console.log("User results response:", response);
      
      // Handle different response structures
      let resultsData = [];
      if (response.data?.results && Array.isArray(response.data.results)) {
        resultsData = response.data.results;
      } else if (Array.isArray(response.data)) {
        resultsData = response.data;
      } else if (Array.isArray(response)) {
        resultsData = response;
      }
      
      console.log("Processed results data:", {
        originalType: typeof response.data,
        processedCount: resultsData.length,
        sampleResult: resultsData[0] || null
      });
      
      setResults(resultsData);
    } catch (error: any) {
      console.error("Error fetching results:", error);
      toast.error("Failed to load assessment results");
      setResults([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-blue-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 90) return "default";
    if (score >= 75) return "secondary";
    if (score >= 60) return "outline";
    return "destructive";
  };

  const handleDownloadCertificate = async (result: AssessmentResult) => {
    if (!result.certificateUrl) return;
    
    try {
      // Create a proper filename with assessment title and certificate code
      const assessmentTitle = result.assessment.title.replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `${assessmentTitle}_Certificate_${result.certificateCode || 'cert'}.pdf`;
      
      // Fetch the PDF blob
      const response = await fetch(result.certificateUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch certificate');
      }
      
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Certificate downloaded successfully!');
    } catch (error) {
      console.error('Error downloading certificate:', error);
      toast.error('Failed to download certificate. Opening in new tab...');
      // Fallback to opening in new tab
      window.open(result.certificateUrl, '_blank');
    }
  };

  // Calculate statistics with safety checks
  const safeResults = Array.isArray(results) ? results : [];
  const totalAssessments = safeResults.length;
  const passedAssessments = safeResults.filter(r => r?.isPassed).length;
  const averageScore = totalAssessments > 0 
    ? Math.round(safeResults.reduce((sum, r) => sum + (r?.score || 0), 0) / totalAssessments)
    : 0;
  const certificatesEarned = safeResults.filter(r => r?.certificateUrl).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-40 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Assessment Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Track your progress and view your achievements
              </p>
            </div>
            <Button 
              onClick={() => router.push("/skill-assessments")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Take New Assessment
            </Button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Assessments</p>
                    <p className="text-2xl font-bold text-gray-900">{totalAssessments}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Passed</p>
                    <p className="text-2xl font-bold text-gray-900">{passedAssessments}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Average Score</p>
                    <p className="text-2xl font-bold text-gray-900">{averageScore}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Trophy className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Certificates</p>
                    <p className="text-2xl font-bold text-gray-900">{certificatesEarned}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Assessment Results */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">Assessment History</h2>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-gray-600">{passedAssessments} Passed</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-500" />
                <span className="text-gray-600">{totalAssessments - passedAssessments} Failed</span>
              </div>
            </div>
          </div>
          
          {safeResults.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Assessments Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start taking skill assessments to track your progress and earn certificates.
                </p>
                <Button 
                  onClick={() => router.push("/skill-assessments")}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Browse Assessments
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {safeResults
                .sort((a, b) => {
                  // Sort by: 1. Date (newest first), 2. Passed status (passed first)
                  const dateA = new Date(a.finishedAt).getTime();
                  const dateB = new Date(b.finishedAt).getTime();
                  if (dateA !== dateB) return dateB - dateA;
                  return b.isPassed ? 1 : -1;
                })
                .map((result) => (
                <Card 
                  key={result.id} 
                  className={`hover:shadow-lg transition-shadow ${
                    !result.isPassed 
                      ? 'border-l-4 border-l-red-400 bg-red-50/30' 
                      : 'border-l-4 border-l-green-400 bg-green-50/30'
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {result.assessment.title}
                          </h3>
                          {result.isPassed ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                        
                        {result.assessment.description && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {result.assessment.description}
                          </p>
                        )}

                        <div className="flex items-center gap-4 mb-4">
                          <Badge variant={getScoreBadgeVariant(result.score)}>
                            {result.score}% Score
                          </Badge>
                          
                          <Badge variant={result.isPassed ? "default" : "secondary"}>
                            {result.isPassed ? "PASSED" : "NOT PASSED"}
                          </Badge>
                          
                          {result.assessment.badgeTemplate && (
                            <Badge variant="outline">
                              <Trophy className="w-3 h-3 mr-1" />
                              {result.assessment.badgeTemplate.category}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(result.finishedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <span>By {result.assessment.creator.name}</span>
                          {result.certificateCode && (
                            <span>Certificate: {result.certificateCode}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Link href={`/skill-assessments/results/${result.assessmentId}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </Link>
                        
                        {result.certificateUrl && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDownloadCertificate(result)}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Certificate
                          </Button>
                        )}
                        
                        {!result.isPassed && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => router.push(`/skill-assessments/${result.assessmentId}`)}
                            className="text-blue-600 border-blue-600 hover:bg-blue-50"
                          >
                            Try Again
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Score Progress Bar */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">Score Progress</span>
                        <span className={`font-semibold ${getScoreColor(result.score)}`}>
                          {result.score}%
                        </span>
                      </div>
                      <Progress value={result.score} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
