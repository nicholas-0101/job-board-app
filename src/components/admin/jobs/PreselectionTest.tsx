import { motion } from "framer-motion";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PreselectionTestHeader, PreselectionActionsBar } from "./PreselectionTestHeader";
import { PreselectionQuestionList } from "./PreselectionQuestionList";

interface TestQuestion {
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
  onCreateJob,
  isCreateMode = false,
}: PreselectionTestProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
    >
      <PreselectionTestHeader
        passingScore={passingScore}
        setPassingScore={setPassingScore}
        isTestActive={isTestActive}
        setIsTestActive={setIsTestActive}
        addQuestion={addQuestion}
        questionsCount={testQuestions.length}
        testLoaded={testLoaded}
      />

      <div className="mb-6">
        <PreselectionActionsBar
          isTestActive={isTestActive}
          questionsCount={testQuestions.length}
          testLoaded={testLoaded}
          addQuestion={addQuestion}
        />
        <PreselectionQuestionList
          isTestActive={isTestActive}
          testQuestions={testQuestions}
          updateQuestion={updateQuestion}
          removeQuestion={removeQuestion}
        />
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-200">
        {isCreateMode ? (
          <Button
            type="button"
            onClick={onCreateJob}
            className="gap-2 bg-[#467EC7] hover:bg-[#578BCC]"
          >
            <Save className="w-4 h-4" />
            Create Job
          </Button>
        ) : (
          <>
            <Button
              type="button"
              onClick={async () => {
                try {
                  await saveTest();
                } catch (err: any) {
                  alert(err?.response?.data?.message || "Failed to save test");
                }
              }}
              className="gap-2 bg-[#467EC7] hover:bg-[#578BCC]"
            >
              <Save className="w-4 h-4" />
              Save Test
            </Button>
            <Link href="/admin/preselection" className="ml-2 inline-flex items-center text-sm text-blue-600 hover:underline">Manage all tests</Link>
          </>
        )}
      </div>
    </motion.div>
  );
}
