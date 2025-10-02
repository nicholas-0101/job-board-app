"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Award, 
  CheckCircle, 
  XCircle, 
  Download, 
  ArrowLeft, 
  Trophy,
  Calendar,
  Clock,
  Target,
  Star,
  Share2
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

export default function AssessmentResultPage() {
  const router = useRouter();
  const params = useParams();
  const assessmentId = parseInt(params.id as string);

  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResult();
  }, [assessmentId]);

  const fetchResult = async () => {
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
      
      console.log("Looking for assessment result:", {
        assessmentId,
        totalResults: resultsData.length,
        resultIds: resultsData.map((r: any) => r.assessmentId)
      });
      
      const assessmentResult = resultsData.find(
        (r: AssessmentResult) => r.assessmentId === assessmentId
      );
      
      if (!assessmentResult) {
        console.log("Assessment result not found for ID:", assessmentId);
        toast.error("Assessment result not found");
        router.push("/skill-assessments");
        return;
      }
      
      console.log("Found assessment result:", assessmentResult);
      setResult(assessmentResult);
    } catch (error: any) {
      console.error("Error fetching result:", error);
      toast.error("Failed to load assessment result");
      router.push("/skill-assessments");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = async () => {
    if (!result?.certificateUrl) return;
    
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

  const handleShareResult = () => {
    if (navigator.share) {
      navigator.share({
        title: `I completed ${result?.assessment.title} assessment!`,
        text: `I scored ${result?.score}% on the ${result?.assessment.title} skill assessment${result?.isPassed ? ' and earned a certificate!' : '.'}`,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Result link copied to clipboard!");
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-blue-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBackground = (score: number) => {
    if (score >= 90) return "bg-green-50 border-green-200";
    if (score >= 75) return "bg-blue-50 border-blue-200";
    if (score >= 60) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  const getPerformanceLevel = (score: number) => {
    if (score >= 95) return { level: "Exceptional", icon: "🌟" };
    if (score >= 90) return { level: "Excellent", icon: "🏆" };
    if (score >= 85) return { level: "Outstanding", icon: "⭐" };
    if (score >= 75) return { level: "Good", icon: "👍" };
    if (score >= 60) return { level: "Fair", icon: "👌" };
    return { level: "Needs Improvement", icon: "📚" };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Result Not Found</h2>
            <p className="text-gray-600 mb-4">We couldn't find your assessment result.</p>
            <Button onClick={() => router.push("/skill-assessments")}>
              Back to Assessments
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const performance = getPerformanceLevel(result.score);
  const completionTime = new Date(result.finishedAt).getTime() - new Date(result.startedAt).getTime();
  const completionMinutes = Math.round(completionTime / (1000 * 60));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/skill-assessments")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Assessments
          </Button>

          <div className="text-center">
            <div className="mb-4">
              {result.isPassed ? (
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              ) : (
                <XCircle className="w-16 h-16 text-red-500 mx-auto" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {result.isPassed ? "Congratulations!" : "Assessment Complete"}
            </h1>
            <p className="text-gray-600">
              {result.isPassed 
                ? "You have successfully passed the assessment!" 
                : "Keep practicing and try again to improve your score."
              }
            </p>
          </div>
        </div>

        {/* Score Card */}
        <Card className={`mb-6 border-2 ${getScoreBackground(result.score)}`}>
          <CardContent className="p-8 text-center">
            <div className="mb-4">
              <div className={`text-6xl font-bold ${getScoreColor(result.score)} mb-2`}>
                {result.score}%
              </div>
              <div className="flex items-center justify-center gap-2 text-lg">
                <span>{performance.icon}</span>
                <span className="font-semibold">{performance.level} Performance</span>
              </div>
            </div>
            
            <Progress value={result.score} className="h-3 mb-4" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <Target className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-semibold">
                  {result.isPassed ? (
                    <span className="text-green-600">PASSED</span>
                  ) : (
                    <span className="text-red-600">NOT PASSED</span>
                  )}
                </p>
              </div>
              
              <div className="text-center">
                <Clock className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                <p className="text-sm text-gray-600">Completion Time</p>
                <p className="font-semibold">{completionMinutes} minutes</p>
              </div>
              
              <div className="text-center">
                <Calendar className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                <p className="text-sm text-gray-600">Completed On</p>
                <p className="font-semibold">
                  {new Date(result.finishedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assessment Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Assessment Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{result.assessment.title}</h3>
                {result.assessment.description && (
                  <p className="text-gray-600 mt-1">{result.assessment.description}</p>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Created by {result.assessment.creator.name}</span>
                {result.assessment.badgeTemplate && (
                  <Badge variant="secondary">
                    <Trophy className="w-3 h-3 mr-1" />
                    {result.assessment.badgeTemplate.category}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Certificate Section */}
        {result.isPassed && result.assessment.badgeTemplate && (
          <Card className="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800">
                <Trophy className="w-5 h-5" />
                Certificate Earned!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-yellow-900">
                    {result.assessment.badgeTemplate.name}
                  </h3>
                  <p className="text-yellow-700 text-sm mb-2">
                    You've earned this certificate for your excellent performance!
                  </p>
                  {result.certificateCode && (
                    <p className="text-xs text-yellow-600">
                      Certificate ID: {result.certificateCode}
                    </p>
                  )}
                </div>
                {result.assessment.badgeTemplate.icon && (
                  <img 
                    src={result.assessment.badgeTemplate.icon} 
                    alt="Badge"
                    className="w-16 h-16 rounded-full"
                  />
                )}
              </div>
              
              {result.certificateUrl && (
                <div className="mt-4 pt-4 border-t border-yellow-200">
                  <Button 
                    onClick={handleDownloadCertificate}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Certificate
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => router.push("/skill-assessments")}
            variant="outline"
            size="lg"
          >
            Take Another Assessment
          </Button>
          
          <Button
            onClick={handleShareResult}
            variant="outline"
            size="lg"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Result
          </Button>
          
          {!result.isPassed && (
            <Button
              onClick={() => router.push(`/skill-assessments/${result.assessmentId}`)}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Try Again
            </Button>
          )}
        </div>

        {/* Improvement Tips */}
        {!result.isPassed && (
          <Card className="mt-6 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">💡 Tips for Improvement</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-blue-700 space-y-2 text-sm">
                <li>• Review the topics covered in this assessment</li>
                <li>• Practice with similar questions and concepts</li>
                <li>• Take your time to read each question carefully</li>
                <li>• You need 75% or higher to pass and earn the certificate</li>
                <li>• Come back when you feel more prepared!</li>
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
