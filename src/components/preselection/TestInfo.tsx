"use client";
import { PreselectionTestDTO } from "@/lib/preselection";

interface TestInfoProps {
  test: PreselectionTestDTO;
  answers: Record<number, string>;
}

export function TestInfo({ test, answers }: TestInfoProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Test Information
        </h2>
        {typeof test.passingScore === "number" && (
          <div className="text-sm text-gray-600">
            Passing Score:{" "}
            <span className="font-semibold text-[#467EC7]">
              {test.passingScore}
            </span>{" "}
            / {test.questions.length}
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
        <div>
          <span className="font-medium">Total Questions:</span>{" "}
          {test.questions.length}
        </div>
        <div>
          <span className="font-medium">Answered:</span>{" "}
          {Object.keys(answers).length}
        </div>
        <div>
          <span className="font-medium">Remaining:</span>{" "}
          {test.questions.length - Object.keys(answers).length}
        </div>
      </div>
    </div>
  );
}
