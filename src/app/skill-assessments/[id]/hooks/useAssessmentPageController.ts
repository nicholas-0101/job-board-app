"use client";
import { useEffect, useMemo, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSubscription } from "@/hooks/useSubscription";
import { useAssessmentState } from "./useAssessmentState";
import { useAssessmentTimer } from "./useAssessmentTimer";

export function useAssessmentPageController() {
  const router = useRouter();
  const params = useParams();
  const rawId = params.id as string;
  const idOrSlug: string | number = /^\d+$/.test(rawId)
    ? parseInt(rawId)
    : rawId;

  const {
    hasSubscription,
    isLoading: subscriptionLoading,
    isAuthenticated,
  } = useSubscription();

  const {
    assessment,
    loading,
    currentQuestion,
    setCurrentQuestion,
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
  } = useAssessmentState(idOrSlug);

  const handleSubmitRef = useRef<
    ((isAutoSubmit?: boolean) => Promise<void>) | null
  >(null);

  const { timeLeft, formatTime, getTimeWarning, stopTimer } =
    useAssessmentTimer({
      onTimeUp: () => handleSubmitRef.current?.(true),
      started,
      initialTime: interruptionInfo?.remainingTime,
    });

  useEffect(() => {
    handleSubmitRef.current = submitAssessmentData;
  }, [submitAssessmentData]);

  useEffect(() => {
    if (hasSubscription === true) {
      fetchAssessment();
    }
  }, [fetchAssessment, hasSubscription]);

  useEffect(() => {
    if (isSubmitted) stopTimer();
    return () => stopTimer();
  }, [isSubmitted, stopTimer]);

  const handlers = useMemo(
    () => ({
      onStart: () => startAssessment(),
      onResume: () => resumeAssessment(),
      onStartNew: () => startNewAssessment(),
      onBack: () => router.push("/skill-assessments"),
      onPrevious: () =>
        currentQuestion > 0 && setCurrentQuestion(currentQuestion - 1),
      onNext: () =>
        assessment &&
        currentQuestion < assessment.questions.length - 1 &&
        setCurrentQuestion(currentQuestion + 1),
      onSubmit: () => submitAssessmentData(false),
    }),
    [
      assessment,
      currentQuestion,
      resumeAssessment,
      router,
      setCurrentQuestion,
      startAssessment,
      startNewAssessment,
      submitAssessmentData,
    ]
  );

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
  const currentQuestionData = assessment?.questions[currentQuestion];

  return {
    // auth/subscription
    hasSubscription,
    subscriptionLoading,
    isAuthenticated,
    // data/state
    assessment,
    loading,
    currentQuestion,
    answers,
    submitting,
    started,
    isSubmitted,
    showResumeDialog,
    interruptionInfo,
    // timer
    timeLeft,
    formatTime,
    getTimeWarning,
    // handlers
    handleAnswerChange,
    fetchAssessment,
    startAssessment,
    resumeAssessment,
    startNewAssessment,
    submitAssessmentData,
    handlers,
    // derived
    answeredCount,
    currentQuestionData,
  };
}
