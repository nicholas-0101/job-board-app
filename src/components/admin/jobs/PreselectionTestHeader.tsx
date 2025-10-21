"use client";
import { TestQuestion } from "./PreselectionTest";

interface PreselectionTestHeaderProps {
  testQuestions: TestQuestion[];
  passingScore: number;
  isTestActive: boolean;
  setPassingScore: (score: number) => void;
}

export function PreselectionTestHeader({
  testQuestions,
  passingScore,
  isTestActive,
  setPassingScore,
}: PreselectionTestHeaderProps) {
  const isTestReady = testQuestions.length === 25;
  
  // Determine visual status for UI
  const visualStatus = isTestActive ? 'active' : testQuestions.length > 0 ? 'draft' : 'inactive';

  return (
    <div className={`rounded-lg shadow-sm border p-6 ${
      visualStatus === 'active' ? 'bg-emerald-50 border-emerald-200' :
      visualStatus === 'draft' ? 'bg-gray-50 border-gray-200' :
      'bg-slate-50 border-slate-200'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Pre-Selection Test</h2>
          <p className="text-sm text-gray-600 mt-1">
            {visualStatus === 'active' ? 'Test is active and ready for applicants' :
             visualStatus === 'draft' ? 'Draft in progress - complete all 25 questions to activate' :
             'Create 25 multiple choice questions for job applicants'}
          </p>
        </div>
        <div className={`px-4 py-2 rounded-lg text-sm font-medium ${
          visualStatus === 'active' ? 'bg-emerald-100 text-emerald-800' :
          visualStatus === 'draft' ? 'bg-gray-100 text-gray-800' :
          'bg-slate-100 text-slate-800'
        }`}>
          {visualStatus === 'active' ? 'ACTIVE' : visualStatus === 'draft' ? 'DRAFT' : 'INACTIVE'}
        </div>
      </div>

      {/* Status Display */}
      <div className={`flex items-center gap-6 p-4 rounded-lg ${
        visualStatus === 'active' ? 'bg-emerald-100' :
        visualStatus === 'draft' ? 'bg-gray-100' :
        'bg-slate-100'
      }`}>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Passing Score:</label>
          <input
            type="number"
            min="1"
            max="25"
            value={passingScore}
            onChange={(e) => setPassingScore(Number(e.target.value))}
            className="w-20 px-3 py-1 border border-gray-300 rounded text-center text-sm"
          />
          <span className="text-sm text-gray-500">correct answers</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Questions:</span>
          <span className={`text-sm font-medium ${
            isTestReady ? 'text-emerald-700' : 
            testQuestions.length > 0 ? 'text-amber-700' : 
            'text-slate-500'
          }`}>
            {testQuestions.length}/25
          </span>
          {testQuestions.length > 0 && (
            <div className={`w-16 h-2 rounded-full ${
              isTestReady ? 'bg-emerald-300' : 'bg-amber-300'
            }`}>
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  isTestReady ? 'bg-emerald-600' : 'bg-amber-600'
                }`}
                style={{ width: `${(testQuestions.length / 25) * 100}%` }}
              ></div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Progress:</span>
          <span className={`text-sm font-medium ${
            isTestReady ? 'text-emerald-700' : 
            testQuestions.length > 0 ? 'text-amber-700' : 
            'text-slate-500'
          }`}>
            {Math.round((testQuestions.length / 25) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}