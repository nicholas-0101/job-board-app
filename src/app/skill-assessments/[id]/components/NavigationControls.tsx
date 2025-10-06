"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";

interface NavigationControlsProps {
  currentQuestion: number;
  totalQuestions: number;
  answeredCount: number;
  submitting: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export default function NavigationControls({
  currentQuestion,
  totalQuestions,
  answeredCount,
  submitting,
  onPrevious,
  onNext,
  onSubmit,
}: NavigationControlsProps) {
  const isFirstQuestion = currentQuestion === 0;
  const isLastQuestion = currentQuestion === totalQuestions - 1;

  return (
    <div className="flex items-center justify-between">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstQuestion}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Previous
      </Button>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Answered: {answeredCount} of {totalQuestions}
        </p>
      </div>

      <div className="flex gap-2">
        {!isLastQuestion ? (
          <Button
            onClick={onNext}
            className="flex items-center gap-2 bg-[#467EC7] hover:bg-[#467EC7]/90"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={onSubmit}
            disabled={submitting}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="w-4 h-4" />
            {submitting ? "Submitting..." : "Submit Assessment"}
          </Button>
        )}
      </div>
    </div>
  );
}
