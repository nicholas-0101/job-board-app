"use client";
import { Button } from "@/components/ui/button";
import { Save, Trash2 } from "lucide-react";
import { TestQuestion } from "./PreselectionTest";

interface PreselectionTestActionsProps {
  testQuestions: TestQuestion[];
  isTestActive: boolean;
  isCreateMode?: boolean;
  onCreateJob?: (e?: React.FormEvent) => void;
  saveTest: () => Promise<void>;
  saveDraft: () => Promise<void>;
  deleteTest: () => Promise<void>;
}

export function PreselectionTestActions({
  testQuestions,
  isTestActive,
  isCreateMode = false,
  onCreateJob,
  saveTest,
  saveDraft,
  deleteTest,
}: PreselectionTestActionsProps) {
  const isTestReady = testQuestions.length === 25;

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {isCreateMode ? (
        <Button
          type="button"
          onClick={onCreateJob}
          className="gap-2 bg-[#467EC7] hover:bg-[#578BCC]"
          disabled={isTestActive && !isTestReady}
        >
          <Save className="w-4 h-4" />
          Create Job
        </Button>
      ) : (
        <>
          {/* Save Draft Button - Always visible if there are questions */}
          {testQuestions.length > 0 && (
            <Button
              type="button"
              onClick={async () => {
                try {
                  await saveDraft();
                } catch (err: any) {
                  alert(err?.response?.data?.message || "Failed to save draft");
                }
              }}
              className="gap-2 bg-[#467EC7] hover:bg-[#578BCC]"
            >
              <Save className="w-4 h-4" />
              Save Draft ({testQuestions.length} questions)
            </Button>
          )}

          {/* Activate Test Button - Always visible if there are questions */}
          {testQuestions.length > 0 && (
            <Button
              type="button"
              onClick={async () => {
                try {
                  await saveTest();
                } catch (err: any) {
                  alert(err?.response?.data?.message || "Failed to activate test");
                }
              }}
              className={`gap-2 ${
                isTestReady ? 'bg-[#24CFA7] hover:bg-[#1fc39c]' : 'bg-gray-400 hover:bg-gray-500'
              }`}
            >
              <Save className="w-4 h-4" />
              {isTestReady ? 'Activate Test' : 'Check & Activate'}
            </Button>
          )}

          {/* Delete Test Button - Always visible if there are questions */}
          {testQuestions.length > 0 && (
            <Button
              type="button"
              onClick={async () => {
                try {
                  await deleteTest();
                } catch (err: any) {
                  alert(err?.response?.data?.message || "Failed to delete test");
                }
              }}
              className="gap-2 bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4" />
              Delete Test
            </Button>
          )}
        </>
      )}
    </div>
  );
}
