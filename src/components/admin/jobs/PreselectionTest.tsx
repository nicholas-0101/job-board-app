import { useState } from "react";
import { motion } from "framer-motion";
import { TestTube, Plus, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Pre-Selection Test</h2>
          <p className="text-gray-600">Create 25 multiple choice questions for job applicants</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Passing Score:</label>
            <input
              type="number"
              min="1"
              max="25"
              value={passingScore}
              onChange={(e) => setPassingScore(Number(e.target.value))}
              className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
            />
            <span className="text-sm text-gray-500">/ 25</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="testActive"
              checked={isTestActive}
              onChange={(e) => setIsTestActive(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="testActive" className="text-sm font-medium text-gray-700">
              Enable Preselection Test
            </label>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-600">Questions: {testQuestions.length}/25</p>
            {testLoaded ? (
              <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">{testQuestions.length ? 'Loaded from server' : 'No test yet'}</span>
            ) : (
              <span className="text-xs text-gray-500">Loading test…</span>
            )}
          </div>
          <Button onClick={addQuestion} className="gap-2 bg-[#24CFA7] hover:bg-[#1fc39c]" disabled={!isTestActive || testQuestions.length>=25}>
            <Plus className="w-4 h-4" />
            Add Question
          </Button>
        </div>

        {isTestActive && testQuestions.length > 0 && (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {testQuestions.map((question, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Question {index + 1}</h4>
                  <button
                    onClick={() => removeQuestion(index)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                    <input
                      type="text"
                      value={question.question}
                      onChange={(e) => updateQuestion(index, "question", e.target.value)}
                      placeholder="Enter the question..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {question.options.map((option, optIndex) => (
                      <div key={optIndex}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Option {String.fromCharCode(65 + optIndex)}
                        </label>
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...question.options];
                            newOptions[optIndex] = e.target.value;
                            updateQuestion(index, "options", newOptions);
                          }}
                          placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Correct Answer</label>
                    <select
                      value={question.answer}
                      onChange={(e) => updateQuestion(index, "answer", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select correct answer</option>
                      {question.options.map((option, optIndex) => (
                        <option key={optIndex} value={option}>
                          {String.fromCharCode(65 + optIndex)}: {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isTestActive && testQuestions.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <TestTube className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No questions added yet. Click "Add Question" to start creating the test.</p>
          </div>
        )}
        {!isTestActive && (
          <div className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg p-4">
            This job currently does not require a preselection test. Toggle "Enable Preselection Test" to create one.
          </div>
        )}
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
