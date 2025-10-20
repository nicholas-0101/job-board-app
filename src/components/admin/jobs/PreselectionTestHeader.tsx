import { TestTube, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PreselectionTestHeader(props: {
  passingScore: number;
  setPassingScore: (score: number) => void;
  isTestActive: boolean;
  setIsTestActive: (active: boolean) => void;
  addQuestion: () => void;
  questionsCount: number;
  testLoaded: boolean;
}) {
  const { passingScore, setPassingScore, isTestActive, setIsTestActive, addQuestion, questionsCount, testLoaded } = props;
  return (
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
          <input type="checkbox" id="testActive" checked={isTestActive} onChange={(e) => setIsTestActive(e.target.checked)} className="rounded" />
          <label htmlFor="testActive" className="text-sm font-medium text-gray-700">Enable Preselection Test</label>
        </div>
      </div>
    </div>
  );
}

export function PreselectionActionsBar(props: {
  isTestActive: boolean;
  questionsCount: number;
  testLoaded: boolean;
  addQuestion: () => void;
}) {
  const { isTestActive, questionsCount, testLoaded, addQuestion } = props;
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-4">
        <p className="text-sm text-gray-600">Questions: {questionsCount}/25</p>
        {testLoaded ? (
          <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">{questionsCount ? 'Loaded from server' : 'No test yet'}</span>
        ) : (
          <span className="text-xs text-gray-500">Loading test…</span>
        )}
      </div>
      <Button onClick={addQuestion} className="gap-2 bg-[#24CFA7] hover:bg-[#1fc39c]" disabled={!isTestActive || questionsCount>=25}>
        <Plus className="w-4 h-4" />
        Add Question
      </Button>
    </div>
  );
}


