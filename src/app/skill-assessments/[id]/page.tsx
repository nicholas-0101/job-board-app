"use client";
import SubscriptionGuard from "@/components/skill-assessments/SubscriptionGuard";
import { useAssessmentPageController } from "./hooks/useAssessmentPageController";
import MainView from "./components/MainView";

export default function TakeAssessmentPage() {
  const controller = useAssessmentPageController();

  if (
    controller.subscriptionLoading ||
    (controller.hasSubscription === true && controller.loading)
  ) {
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

  if (
    controller.isAuthenticated === false ||
    controller.hasSubscription === false
  ) {
    return (
      <SubscriptionGuard
        hasSubscription={controller.hasSubscription}
        isAuthenticated={controller.isAuthenticated}
        onUpgrade={() => controller.handlers.onBack()}
        onSignIn={() => controller.handlers.onBack()}
      />
    );
  }

  if (!controller.assessment) {
    return (
      <div className="min-h-screen bg-[#F0F5F9] py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Assessment not found
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <MainView
      assessment={controller.assessment}
      timeLeft={controller.timeLeft}
      formatTime={controller.formatTime}
      getTimeWarning={controller.getTimeWarning}
      started={controller.started}
      currentQuestion={controller.currentQuestion}
      currentQuestionData={controller.currentQuestionData}
      answers={controller.answers}
      answeredCount={controller.answeredCount}
      submitting={controller.submitting}
      showResumeDialog={controller.showResumeDialog}
      interruptionInfo={controller.interruptionInfo}
      onBack={controller.handlers.onBack}
      onStart={controller.handlers.onStart}
      onResume={controller.handlers.onResume}
      onStartNew={controller.handlers.onStartNew}
      onAnswerChange={controller.handleAnswerChange}
      onPrevious={controller.handlers.onPrevious}
      onNext={controller.handlers.onNext}
      onSubmit={controller.handlers.onSubmit}
    />
  );
}
