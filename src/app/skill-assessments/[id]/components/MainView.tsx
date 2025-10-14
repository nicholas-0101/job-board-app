"use client";
import AssessmentHeader from "./AssessmentHeader";
import StartScreen from "./StartScreen";
import QuestionDisplay from "./QuestionDisplay";
import NavigationControls from "./NavigationControls";
import ResumeDialog from "./ResumeDialog";
import AssessmentLimitGuard from "@/components/skill-assessments/AssessmentLimitGuard";

interface Props {
  assessment: any;
  timeLeft: number;
  formatTime: (n: number) => string;
  getTimeWarning: () => string;
  started: boolean;
  currentQuestion: number;
  currentQuestionData: any;
  answers: Record<number, string>;
  answeredCount: number;
  submitting: boolean;
  showResumeDialog: boolean;
  interruptionInfo: any;
  onBack: () => void;
  onStart: () => void;
  onResume: () => void;
  onStartNew: () => void;
  onAnswerChange: (id: number, value: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export default function MainView(props: Props) {
  const {
    assessment,
    timeLeft,
    formatTime,
    getTimeWarning,
    started,
    currentQuestion,
    currentQuestionData,
    answers,
    answeredCount,
    submitting,
    showResumeDialog,
    interruptionInfo,
    onBack,
    onStart,
    onResume,
    onStartNew,
    onAnswerChange,
    onPrevious,
    onNext,
    onSubmit,
  } = props;

  if (!assessment) return null;

  return (
    <AssessmentLimitGuard assessmentId={assessment?.id || 0}>
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
            onBack={onBack}
          />

          {!started ? (
            <StartScreen
              title={assessment.title}
              description={assessment.description}
              questionCount={assessment.questions.length}
              passScore={assessment.passScore}
              badgeTemplate={assessment.badgeTemplate}
              onStart={onStart}
            />
          ) : (
            <div className="space-y-6">
              <QuestionDisplay
                question={currentQuestionData}
                questionIndex={currentQuestion}
                totalQuestions={assessment.questions.length}
                selectedAnswer={answers[currentQuestionData.id]}
                onAnswerChange={onAnswerChange}
              />

              <NavigationControls
                currentQuestion={currentQuestion}
                totalQuestions={assessment.questions.length}
                answeredCount={answeredCount}
                submitting={submitting}
                onPrevious={onPrevious}
                onNext={onNext}
                onSubmit={onSubmit}
              />
            </div>
          )}

          <ResumeDialog
            show={showResumeDialog}
            interruptionInfo={interruptionInfo}
            onResume={onResume}
            onStartNew={onStartNew}
          />
        </div>
      </div>
    </AssessmentLimitGuard>
  );
}
