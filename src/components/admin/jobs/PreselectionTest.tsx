"use client";
import { Plus } from "lucide-react";
import { PreselectionQuestionList } from "./PreselectionQuestionList";
import { PreselectionTestHeader } from "./PreselectionTestHeader";
import { PreselectionTestActions } from "./PreselectionTestActions";
import { PreselectionTestEmptyState } from "./PreselectionTestEmptyState";

export interface TestQuestion {
  question: string;
  options: string[];
  answer: string;
}

interface PreselectionTestProps {
  testQuestions: TestQuestion[];
  passingScore: number;
  isTestActive: boolean;
  testLoaded: boolean;
  setPassingScore: (score: number) => void;
  setIsTestActive: (active: boolean) => void;
  addQuestion: () => void;
  updateQuestion: (index: number, field: string, value: any) => void;
  removeQuestion: (index: number) => void;
  saveTest: () => Promise<void>;
  saveDraft: () => Promise<void>;
  deleteTest: () => Promise<void>;
  onCreateJob?: (e?: React.FormEvent) => void;
  isCreateMode?: boolean;
}

export default function PreselectionTest({
  testQuestions,
  passingScore,
  isTestActive,
  testLoaded,
  setPassingScore,
  setIsTestActive,
  addQuestion,
  updateQuestion,
  removeQuestion,
  saveTest,
  saveDraft,
  deleteTest,
  onCreateJob,
  isCreateMode = false,
}: PreselectionTestProps) {
  const canAddMore = testQuestions.length < 25;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <PreselectionTestHeader
        testQuestions={testQuestions}
        passingScore={passingScore}
        isTestActive={isTestActive}
        setPassingScore={setPassingScore}
      />

      {/* Questions Section */}
      {testQuestions.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Test Questions</h3>
            {canAddMore && (
              <button
                onClick={addQuestion}
                  className="px-4 py-2 bg-[#467EC7] text-white rounded-lg hover:bg-[#578BCC] transition-colors text-sm font-medium flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Question
              </button>
            )}
          </div>

          <PreselectionQuestionList
            isTestActive={isTestActive}
            testQuestions={testQuestions}
            updateQuestion={updateQuestion}
            removeQuestion={removeQuestion}
          />
        </div>
      )}

      {/* Add Test Section - Only for INACTIVE status */}
      {testQuestions.length === 0 && (
        <PreselectionTestEmptyState addQuestion={addQuestion} />
      )}

      {/* Action Buttons */}
      <PreselectionTestActions
        testQuestions={testQuestions}
        isTestActive={isTestActive}
        isCreateMode={isCreateMode}
        onCreateJob={onCreateJob}
        saveTest={saveTest}
        saveDraft={saveDraft}
        deleteTest={deleteTest}
      />
    </div>
  );
}