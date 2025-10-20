import { Trash2, TestTube } from "lucide-react";

export function PreselectionQuestionList(props: {
  isTestActive: boolean;
  testQuestions: Array<{ question: string; options: string[]; answer: string }>;
  updateQuestion: (index: number, field: string, value: any) => void;
  removeQuestion: (index: number) => void;
}) {
  const { isTestActive, testQuestions, updateQuestion, removeQuestion } = props;

  if (isTestActive && testQuestions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <TestTube className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>No questions added yet. Click "Add Question" to start creating the test.</p>
      </div>
    );
  }

  if (!isTestActive) {
    return (
      <div className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg p-4">
        This job currently does not require a preselection test. Toggle "Enable Preselection Test" to create one.
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {testQuestions.map((question, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">Question {index + 1}</h4>
            <button onClick={() => removeQuestion(index)} className="text-red-600 hover:text-red-800 transition-colors">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Option {String.fromCharCode(65 + optIndex)}</label>
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
  );
}


