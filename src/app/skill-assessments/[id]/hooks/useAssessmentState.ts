import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
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

export function useAssessmentState(assessmentId: number) {
  const router = useRouter();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [started, setStarted] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const fetchAssessment = useCallback(async () => {
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
  }, [assessmentId, router]);

  const handleAnswerChange = useCallback((questionId: number, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  }, []);

  const startAssessment = useCallback(() => {
    setStarted(true);
    setStartTime(new Date());
  }, []);

  const submitAssessmentData = useCallback(async (isAutoSubmit = false) => {
    if (isSubmitted || submitting || !assessment || !startTime) {
      return;
    }

    const answeredCount = Object.keys(answers).length;
    
    // For manual submit, require at least one answer
    // For auto-submit, allow submission even with 0 answers
    if (!isAutoSubmit && answeredCount === 0) {
      toast.error("Please answer at least one question before submitting");
      return;
    }

    try {
      setSubmitting(true);
      setIsSubmitted(true);

      const formattedAnswers = assessment.questions
        .map((question) => ({
          questionId: question.id,
          answer: answers[question.id] || "",
        }))
        .filter(answer => answer.answer !== ""); // Only send answered questions

      const response = await submitAssessment({
        assessmentId,
        answers: formattedAnswers,
        startedAt: startTime.toISOString(),
      });

      const message = isAutoSubmit 
        ? `Time's up! Assessment submitted automatically with ${answeredCount} answers.`
        : `Assessment submitted successfully with ${answeredCount} answers!`;
      
      toast.success(message);
      
      // Use result ID from response for redirect
      const resultId = response.data?.result?.id;
      if (resultId) {
        router.push(`/skill-assessments/results/${resultId}`);
      } else {
        // Fallback to dashboard if no result ID
        router.push('/skill-assessments/dashboard');
      }
    } catch (error: any) {
      setSubmitting(false);
      setIsSubmitted(false);
      toast.error(error.response?.data?.message || "Failed to submit assessment");
    }
  }, [assessment, answers, startTime, isSubmitted, submitting, assessmentId, router]);

  return {
    assessment,
    loading,
    currentQuestion,
    setCurrentQuestion,
    answers,
    submitting,
    started,
    isSubmitted,
    handleAnswerChange,
    fetchAssessment,
    startAssessment,
    submitAssessmentData,
  };
}
