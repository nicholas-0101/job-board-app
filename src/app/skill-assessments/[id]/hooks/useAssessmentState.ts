import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAssessmentForUser, submitAssessment } from "@/lib/skillAssessment";
import toast from "react-hot-toast";
import { useAssessmentPersistence } from "./useAssessmentPersistence";

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
  const [originalStartTime, setOriginalStartTime] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [interruptionInfo, setInterruptionInfo] = useState<any>(null);

  const {
    saveProgress,
    getProgress,
    clearProgress,
    initializeAssessment,
    hasExistingSession,
    getInterruptionInfo,
    updateTimeSpent,
  } = useAssessmentPersistence(assessmentId);

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

  // Load existing progress on component mount
  useEffect(() => {
    const existingProgress = getProgress();
    if (existingProgress) {
      // Restore state from localStorage
      setCurrentQuestion(existingProgress.currentQuestion);
      setAnswers(existingProgress.answers);
      setStartTime(new Date(existingProgress.startTime));
      setOriginalStartTime(existingProgress.startTime);
      
      const info = getInterruptionInfo();
      setInterruptionInfo(info);
      
      // Show dialog only for significant interruptions (> 5 minutes)
      if (info && info.wasInterrupted) {
        setShowResumeDialog(true);
      } else {
        // Auto-resume for page refresh or short interruptions
        setStarted(true);
        if (info && info.timeSinceLastActive > 30) {
          toast.success(`Assessment resumed! Time remaining: ${Math.floor(info.remainingTime / 60)}:${(info.remainingTime % 60).toString().padStart(2, '0')}`);
        }
      }
    }
  }, [getProgress, getInterruptionInfo]);

  const handleAnswerChange = useCallback((questionId: number, answer: string) => {
    setAnswers((prev) => {
      const newAnswers = {
        ...prev,
        [questionId]: answer,
      };
      
      // Save to localStorage
      saveProgress({
        answers: newAnswers,
        currentQuestion,
      });
      
      return newAnswers;
    });
  }, [saveProgress, currentQuestion]);

  const startAssessment = useCallback(() => {
    const totalDuration = 3 * 60; // 3 minutes
    const result = initializeAssessment(totalDuration);
    
    setStarted(true);
    setStartTime(result.startTime);
    setOriginalStartTime(result.originalStartTime);
    setCurrentQuestion(result.currentQuestion);
    setAnswers(result.answers);
    
    return result;
  }, [initializeAssessment]);

  const resumeAssessment = useCallback(() => {
    if (interruptionInfo) {
      setStarted(true);
      setShowResumeDialog(false);
      
      if (interruptionInfo.wasInterrupted) {
        toast.success(
          `Assessment resumed! You have ${Math.floor(interruptionInfo.remainingTime / 60)}:${(interruptionInfo.remainingTime % 60).toString().padStart(2, '0')} remaining.`
        );
      }
      
      return {
        remainingTime: interruptionInfo.remainingTime,
        isResuming: true,
      };
    }
    return null;
  }, [interruptionInfo]);

  const startNewAssessment = useCallback(() => {
    clearProgress();
    setShowResumeDialog(false);
    setInterruptionInfo(null);
    startAssessment();
  }, [clearProgress, startAssessment]);

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

      // Clear localStorage immediately to prevent duplicate submissions
      clearProgress();

      const formattedAnswers = assessment.questions
        .map((question) => ({
          questionId: question.id,
          answer: answers[question.id] || "",
        }))
        .filter(answer => answer.answer !== ""); // Only send answered questions

      const response = await submitAssessment({
        assessmentId,
        answers: formattedAnswers,
        startedAt: originalStartTime || startTime.toISOString(),
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
      
      if (error.response?.status === 403 && error.response?.data?.code === 'ASSESSMENT_LIMIT_EXCEEDED') {
        toast.error(`Assessment limit reached! ${error.response.data.message}`);
      } else {
        toast.error(error.response?.data?.message || "Failed to submit assessment");
      }
    }
  }, [assessment, answers, startTime, originalStartTime, isSubmitted, submitting, assessmentId, router, clearProgress]);

  // Update current question in localStorage
  const updateCurrentQuestion = useCallback((questionIndex: number) => {
    setCurrentQuestion(questionIndex);
    saveProgress({ currentQuestion: questionIndex });
  }, [saveProgress]);

  // Periodically update time spent
  useEffect(() => {
    if (!started) return;

    const interval = setInterval(() => {
      updateTimeSpent();
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [started, updateTimeSpent]);

  return {
    assessment,
    loading,
    currentQuestion,
    setCurrentQuestion: updateCurrentQuestion,
    answers,
    submitting,
    started,
    isSubmitted,
    showResumeDialog,
    interruptionInfo,
    handleAnswerChange,
    fetchAssessment,
    startAssessment,
    resumeAssessment,
    startNewAssessment,
    submitAssessmentData,
  };
}
