import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getAssessmentForUser,
  getAssessmentForUserBySlug,
} from "@/lib/skillAssessment";
import toast from "react-hot-toast";
import { useAssessmentPersistence } from "../useAssessmentPersistence";
import { useAssessmentSubmit } from "../useAssessmentSubmit";
import type { Assessment } from "./types";

export default function useAssessmentStateCore(
  assessmentIdOrSlug: number | string
) {
  const router = useRouter();
  const numericId =
    typeof assessmentIdOrSlug === "number"
      ? assessmentIdOrSlug
      : parseInt(assessmentIdOrSlug as string);
  const isNumeric = !isNaN(numericId);
  const persistenceId = isNumeric
    ? numericId
    : Array.from(String(assessmentIdOrSlug)).reduce(
        (acc, ch) => (acc << 5) - acc + ch.charCodeAt(0),
        0
      ) >>> 0;

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [started, setStarted] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [originalStartTime, setOriginalStartTime] = useState<string | null>(
    null
  );
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
  } = useAssessmentPersistence(persistenceId);

  const fetchAssessment = useCallback(async () => {
    try {
      setLoading(true);
      const response = isNumeric
        ? await getAssessmentForUser(numericId)
        : await getAssessmentForUserBySlug(String(assessmentIdOrSlug));
      setAssessment(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load assessment");
      router.push("/skill-assessments");
    } finally {
      setLoading(false);
    }
  }, [assessmentIdOrSlug, isNumeric, numericId, router]);

  useEffect(() => {
    const existingProgress = getProgress();
    if (existingProgress) {
      setCurrentQuestion(existingProgress.currentQuestion);
      setAnswers(existingProgress.answers);
      setStartTime(new Date(existingProgress.startTime));
      setOriginalStartTime(existingProgress.startTime);

      const info = getInterruptionInfo();
      setInterruptionInfo(info);

      if (info && info.wasInterrupted) {
        setShowResumeDialog(true);
      } else {
        setStarted(true);
        if (info && info.timeSinceLastActive > 30) {
          toast.success(
            `Assessment resumed! Time remaining: ${Math.floor(
              info.remainingTime / 60
            )}:${(info.remainingTime % 60).toString().padStart(2, "0")}`
          );
        }
      }
    }
  }, [getProgress, getInterruptionInfo]);

  const handleAnswerChange = useCallback(
    (questionId: number, answer: string) => {
      setAnswers((prev) => {
        const newAnswers = {
          ...prev,
          [questionId]: answer,
        };

        saveProgress({
          answers: newAnswers,
          currentQuestion,
        });

        return newAnswers;
      });
    },
    [saveProgress, currentQuestion]
  );

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
          `Assessment resumed! You have ${Math.floor(
            interruptionInfo.remainingTime / 60
          )}:${(interruptionInfo.remainingTime % 60)
            .toString()
            .padStart(2, "0")} remaining.`
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

  const { submitAssessmentData } = useAssessmentSubmit({
    assessment,
    answers,
    startTime,
    originalStartTime,
    isSubmitted,
    submitting,
    clearProgress,
    setSubmitting,
    setIsSubmitted,
  });

  const updateCurrentQuestion = useCallback(
    (questionIndex: number) => {
      setCurrentQuestion(questionIndex);
      saveProgress({ currentQuestion: questionIndex });
    },
    [saveProgress]
  );

  useEffect(() => {
    if (!started) return;
    const interval = setInterval(() => {
      updateTimeSpent();
    }, 10000);
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
