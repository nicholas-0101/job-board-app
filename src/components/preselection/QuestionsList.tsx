"use client";
import { PreselectionTestDTO } from "@/lib/preselection";

interface QuestionProps {
  question: {
    id: number;
    question: string;
    options: string[];
  };
  index: number;
  answers: Record<number, string>;
  onSelect: (questionId: number, option: string) => void;
}

export function Question({ question, index, answers, onSelect }: QuestionProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-4 text-lg">
        {index + 1}. {question.question}
      </h3>
      <div className="space-y-3">
        {question.options.map((opt) => (
          <label
            key={opt}
            className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:border-[#24CFA7]/60 hover:bg-[#24CFA7]/5 transition-colors"
          >
            <input
              type="radio"
              name={`q-${question.id}`}
              value={opt}
              checked={answers[question.id] === opt}
              onChange={() => onSelect(question.id, opt)}
              className="text-[#24CFA7] focus:ring-[#24CFA7]"
            />
            <span className="text-gray-700">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

interface QuestionsListProps {
  test: PreselectionTestDTO;
  answers: Record<number, string>;
  onSelect: (questionId: number, option: string) => void;
}

export function QuestionsList({ test, answers, onSelect }: QuestionsListProps) {
  return (
    <div className="space-y-6">
      {test.questions.map((question, idx) => (
        <Question
          key={question.id}
          question={question}
          index={idx}
          answers={answers}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
