"use client";
import { PreselectionTestDTO } from "@/lib/preselection";

interface SubmitSectionProps {
  test: PreselectionTestDTO;
  answers: Record<number, string>;
  submitting: boolean;
  onSubmit: () => void;
}

export function SubmitSection({ test, answers, submitting, onSubmit }: SubmitSectionProps) {
  const canSubmit = test.questions.every(
    (q) => typeof answers[q.id] === "string" && answers[q.id]!.length > 0
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {canSubmit ? (
            <span className="text-muted-foreground">
              All questions answered
            </span>
          ) : (
            <span className="text-red-400">
              Please answer all questions
            </span>
          )}
        </div>
        <button
          onClick={onSubmit}
          disabled={!canSubmit || submitting}
          className="px-8 py-3 bg-[#24CFA7] text-white rounded-lg hover:bg-[#24CFA7]/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {submitting ? (
            <div className="flex items-center gap-2">Submitting...</div>
          ) : (
            "Submit Test"
          )}
        </button>
      </div>
    </div>
  );
}
