"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Award,
  Clock,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Trophy,
  User,
} from "lucide-react";
import { getAssessmentForUser, submitAssessment } from "@/lib/skillAssessment";
import toast from "react-hot-toast";

interface Question {
  id: number;
  question: string;
  options: string[];
}

interface Assessment {
  id: number;
  title: string;
  description?: string;
  questions: Question[];
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
}

export default function TakeAssessmentPage() {
  const router = useRouter();
  const params = useParams();
  const assessmentId = parseInt(params.id as string);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const [started, setStarted] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Ref to store latest handleSubmit function
  const handleSubmitRef = useRef<((isAutoSubmit?: boolean) => Promise<void>) | null>(null);

  useEffect(() => {
    fetchAssessment();
  }, [assessmentId]);

  const fetchAssessment = async () => {
    try {
      setLoading(true);
      const response = await getAssessmentForUser(assessmentId);
      setAssessment(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load assessment");
      router.push("/skill-assessments");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = useCallback(async (isAutoSubmit = false) => {
    
    // Prevent double submission
    if (isSubmitted || submitting) {
      return;
    }
    
    if (!assessment) {
      return;
    }

    // No validation required - allow partial submissions
    const answeredCount = Object.keys(answers).length;
    const totalQuestions = assessment.questions.length;

    try {
      setSubmitting(true);
      setIsSubmitted(true);

      // Always send only answered questions (no empty answers)
      const answeredQuestions = assessment.questions.filter(q => answers[q.id]);

      const submissionData = {
        assessmentId: assessment.id,
        startedAt: startTime?.toISOString() || new Date().toISOString(),
        answers: answeredQuestions.map((q) => ({
          questionId: q.id,
          selectedAnswer: answers[q.id],
        })),
      };


      const result = await submitAssessment(submissionData);

      toast.success("Assessment submitted successfully!");
      router.push(`/skill-assessments/results/${assessment.id}`);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to submit assessment"
      );
    } finally {
      setSubmitting(false);
    }
  }, [assessment, answers, startTime, router, isSubmitted, submitting]);

  // Update ref whenever handleSubmit changes
  useEffect(() => {
    handleSubmitRef.current = handleSubmit;
  }, [handleSubmit]);

  // Auto-submit when time reaches 0
  useEffect(() => {
    if (timeLeft === 0 && started && !isSubmitted) {
      toast.error("Time's up! Auto-submitting your assessment...");
      handleSubmit(true); // Auto-submit
    }
  }, [timeLeft, started, isSubmitted, handleSubmit]);

  // Timer effect - simple countdown
  useEffect(() => {
    if (started && timeLeft > 0 && !isSubmitted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          // console.log("⏰ Timer tick:", newTime); // Disabled for production
          
          // Warnings for 30 minute assessment
          if (newTime === 300) {
            toast("⚠️ Only 5 minutes remaining!", {
              icon: "⏰",
              duration: 4000,
              style: {
                background: "#FEF3C7",
                color: "#92400E",
                border: "1px solid #F59E0B",
              },
            });
          }
          
          if (newTime === 60) {
            toast("⚠️ Only 1 minute remaining!", {
              icon: "🚨",
              duration: 5000,
              style: {
                background: "#FEE2E2",
                color: "#B91C1C",
                border: "1px solid #EF4444",
              },
            });
          }
          
          return Math.max(0, newTime);
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [started, isSubmitted]);

  // Wrapper function for button onClick
  const handleManualSubmit = () => {
    handleSubmit(false);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = assessment
    ? ((currentQuestion + 1) / assessment.questions.length) * 100
    : 0;
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = assessment?.questions.length || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Assessment Not Found</h2>
            <p className="text-gray-600 mb-4">
              The assessment you're looking for doesn't exist or has been
              removed.
            </p>
            <Button onClick={() => router.push("/skill-assessments")}>
              Back to Assessments
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => router.push("/skill-assessments")}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Assessments
          </Button>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">
                    {assessment.title}
                  </CardTitle>
                  {assessment.description && (
                    <p className="text-gray-600">{assessment.description}</p>
                  )}
                </div>
                {assessment.badgeTemplate && (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <Trophy className="w-4 h-4 mr-1" />
                    Certificate Available
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Assessment Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-blue-600">Duration</p>
                    <p className="font-semibold">30 minutes</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-green-600">Questions</p>
                    <p className="font-semibold">
                      {assessment.questions.length} questions
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                  <Award className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-purple-600">Passing Score</p>
                    <p className="font-semibold">75%</p>
                  </div>
                </div>
              </div>

              {/* Badge Info */}
              {assessment.badgeTemplate && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h3 className="font-semibold text-yellow-900 mb-2">
                    🏆 Certificate Reward
                  </h3>
                  <p className="text-yellow-800">
                    Complete this assessment with a score of 75% or higher to
                    earn the
                    <strong> {assessment.badgeTemplate.name}</strong>{" "}
                    certificate.
                  </p>
                </div>
              )}

              {/* Creator Info */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>Created by {assessment.creator.name}</span>
              </div>

              {/* Instructions */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Instructions</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>
                    • You have 30 minutes to complete all{" "}
                    {assessment.questions.length} questions
                  </li>
                  <li>• You can submit with partial answers</li>
                  <li>• You need 75% or higher to pass</li>
                  <li>• You can only take this assessment once</li>
                </ul>
              </div>

              {/* Start Button */}
              <div className="flex justify-center pt-4">
                <Button
                  onClick={() => {
                    setStartTime(new Date());
                    setStarted(true);
                  }}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Start Assessment
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentQ = assessment.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">{assessment.title}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4" />
                <span
                  className={timeLeft < 300 ? "text-red-600 font-semibold" : ""}
                >
                  {formatTime(timeLeft)}
                </span>
              </div>
              <Badge variant="outline">
                {answeredCount}/{totalQuestions} answered
              </Badge>
            </div>
          </div>

          <Progress value={progress} className="h-2" />
          <p className="text-sm text-gray-600 mt-2">
            Question {currentQuestion + 1} of {assessment.questions.length}
          </p>
        </div>

        {/* Question Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{currentQ.question}</CardTitle>
          </CardHeader>

          <CardContent>
            <RadioGroup
              value={answers[currentQ.id] || ""}
              onValueChange={(value: string) =>
                handleAnswerChange(currentQ.id, value)
              }
            >
              {currentQ.options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50"
                >
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label
                    htmlFor={`option-${index}`}
                    className="flex-1 cursor-pointer"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2">
            {currentQuestion === assessment.questions.length - 1 ? (
              <Button
                onClick={handleManualSubmit}
                disabled={submitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {submitting ? "Submitting..." : "Submit Assessment"}
                <CheckCircle className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={() =>
                  setCurrentQuestion((prev) =>
                    Math.min(assessment.questions.length - 1, prev + 1)
                  )
                }
                disabled={currentQuestion === assessment.questions.length - 1}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>

        {/* Question Overview */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Question Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {assessment.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`
                    w-8 h-8 rounded text-sm font-medium transition-colors
                    ${
                      index === currentQuestion
                        ? "bg-blue-600 text-white"
                        : answers[assessment.questions[index].id]
                        ? "bg-green-100 text-green-800 border border-green-300"
                        : "bg-gray-100 text-gray-600 border border-gray-300"
                    }
                  `}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
