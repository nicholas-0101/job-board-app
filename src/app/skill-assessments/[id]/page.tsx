"use client";
import { useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAssessmentState } from "./hooks/useAssessmentState";
import { useAssessmentTimer } from "./hooks/useAssessmentTimer";
import { useSubscription } from "@/hooks/useSubscription";
import AssessmentHeader from "./components/AssessmentHeader";
import StartScreen from "./components/StartScreen";
import QuestionDisplay from "./components/QuestionDisplay";
import NavigationControls from "./components/NavigationControls";
import SubscriptionGuard from "@/components/skill-assessments/SubscriptionGuard";
import AssessmentLimitGuard from "@/components/skill-assessments/AssessmentLimitGuard";

export default function TakeAssessmentPage() {
  const router = useRouter();
  const params = useParams();
  const assessmentId = parseInt(params.id as string);
  const { hasSubscription, isLoading: subscriptionLoading, isAuthenticated } = useSubscription();
  
  const {
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
  } = useAssessmentState(assessmentId);

  const handleSubmitRef = useRef<((isAutoSubmit?: boolean) => Promise<void>) | null>(null);
  
  const { timeLeft, formatTime, getTimeWarning, stopTimer } = useAssessmentTimer({
    onTimeUp: () => handleSubmitRef.current?.(true),
    started,
  });

  // Update ref when submitAssessmentData changes
  useEffect(() => {
    handleSubmitRef.current = submitAssessmentData;
  }, [submitAssessmentData]);

  useEffect(() => {
    // Only fetch assessment if user has subscription
    if (hasSubscription === true) {
      fetchAssessment();
    }
  }, [fetchAssessment, hasSubscription]);

  // Cleanup timer on unmount or submission
  useEffect(() => {
    if (isSubmitted) {
      stopTimer();
    }
    return () => stopTimer();
  }, [isSubmitted, stopTimer]);

  const handleStart = () => {
    startAssessment();
  };

  const handleBack = () => {
    router.push("/skill-assessments");
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleNext = () => {
    if (assessment && currentQuestion < assessment.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleSubmit = () => {
    submitAssessmentData(false);
  };

  // Show loading state while checking subscription
  if (subscriptionLoading || (hasSubscription === true && loading)) {
    return (
      <div className="min-h-screen bg-[#F0F5F9] py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show subscription guard if not authenticated or no subscription
  if (isAuthenticated === false || hasSubscription === false) {
    return (
      <SubscriptionGuard 
        hasSubscription={hasSubscription}
        isAuthenticated={isAuthenticated}
        onUpgrade={() => router.push('/subscription')}
        onSignIn={() => router.push('/signin')}
      />
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-[#F0F5F9] py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Assessment not found</h1>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestionData = assessment.questions[currentQuestion];
  const answeredCount = Object.keys(answers).length;

  return (
    <AssessmentLimitGuard assessmentId={assessmentId}>
      <div className="min-h-screen bg-[#F0F5F9] py-8">
        <div className="max-w-4xl mx-auto px-4">
          <AssessmentHeader
          title={assessment.title}
          description={assessment.description}
          creatorName={assessment.creator.name}
          badgeTemplate={assessment.badgeTemplate}
          timeLeft={timeLeft}
          formatTime={formatTime}
          getTimeWarning={getTimeWarning}
          started={started}
          onBack={handleBack}
        />

        {!started ? (
          <StartScreen
            title={assessment.title}
            description={assessment.description}
            questionCount={assessment.questions.length}
            badgeTemplate={assessment.badgeTemplate}
            onStart={handleStart}
          />
        ) : (
          <div className="space-y-6">
            <QuestionDisplay
              question={currentQuestionData}
              questionIndex={currentQuestion}
              totalQuestions={assessment.questions.length}
              selectedAnswer={answers[currentQuestionData.id]}
              onAnswerChange={handleAnswerChange}
            />

            <NavigationControls
              currentQuestion={currentQuestion}
              totalQuestions={assessment.questions.length}
              answeredCount={answeredCount}
              submitting={submitting}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onSubmit={handleSubmit}
            />
          </div>
        )}
      </div>
    </div>
    </AssessmentLimitGuard>
  );
}
