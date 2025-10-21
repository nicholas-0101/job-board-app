import { Trash2, TestTube } from "lucide-react";

export function PreselectionQuestionList(props: {
  isTestActive: boolean;
  testQuestions: Array<{ question: string; options: string[]; answer: string }>;
  updateQuestion: (index: number, field: string, value: any) => void;
  removeQuestion: (index: number) => void;
}) {
  const { isTestActive, testQuestions, updateQuestion, removeQuestion } = props;

  // Count completed questions
  const completedQuestions = testQuestions.filter(q => 
    q.question.trim() && 
    q.options.every(opt => opt.trim()) && 
    q.answer.trim()
  ).length;

  if (!isTestActive && testQuestions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <TestTube className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p className="text-lg font-medium mb-2">Ready to Start</p>
        <p className="text-sm">Click "Add First Question" to begin creating your test.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {testQuestions.map((question, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-5 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-[#467EC7] text-white rounded-full text-sm font-medium">
                Question {index + 1}
              </span>
              {question.question && question.options.every(opt => opt.trim()) && question.answer && (
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  Complete
                </span>
              )}
            </div>
            <button 
              onClick={() => removeQuestion(index)} 
              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              title="Remove question"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
              <textarea
                value={question.question}
                onChange={(e) => updateQuestion(index, "question", e.target.value)}
                placeholder="Enter the question..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#467EC7] focus:border-transparent resize-none"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {question.options.map((option, optIndex) => (
                <div key={optIndex}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#467EC7] focus:border-transparent"
                  />
                </div>
              ))}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
              <select
                value={question.answer}
                onChange={(e) => updateQuestion(index, "answer", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#467EC7] focus:border-transparent"
              >
                <option value="">Select correct answer</option>
                {question.options.map((option, optIndex) => (
                  <option key={optIndex} value={option}>
                    {String.fromCharCode(65 + optIndex)}: {option || `Option ${String.fromCharCode(65 + optIndex)}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      ))}
      
      {testQuestions.length < 25 && (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
          <TestTube className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm">Add more questions to complete the test (25 questions required)</p>
          <p className="text-xs text-gray-400 mt-1">
            Progress: {completedQuestions}/{testQuestions.length} questions completed
          </p>
        </div>
      )}
      
    </div>
  );
}


