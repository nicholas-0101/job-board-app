"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Question } from "@/lib/skillAssessment";

interface QuestionFieldsProps {
  index: number;
  question: Question;
  onQuestionTextChange: (value: string) => void;
  onOptionChange: (optionIndex: number, value: string) => void;
  onAnswerChange: (value: string) => void;
}

export function QuestionFields({
  index,
  question,
  onQuestionTextChange,
  onOptionChange,
  onAnswerChange,
}: QuestionFieldsProps) {
  return (
    <div className="flex-1 space-y-3 sm:space-y-4 min-w-0">
      <div>
        <Label
          htmlFor={`question-${index}`}
          className="text-sm sm:text-base"
        >
          Question {index + 1} *
        </Label>
        <Input
          id={`question-${index}`}
          value={question.question}
          onChange={(e) => onQuestionTextChange(e.target.value)}
          placeholder="Enter your question"
          required
          className="text-sm sm:text-base w-full"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {question.options.map((option, optIndex) => (
          <div key={optIndex}>
            <Label
              htmlFor={`option-${index}-${optIndex}`}
              className="text-sm sm:text-base"
            >
              Option {String.fromCharCode(65 + optIndex)} *
            </Label>
            <Input
              id={`option-${index}-${optIndex}`}
              value={option}
              onChange={(e) =>
                onOptionChange(optIndex, e.target.value)
              }
              placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
              required
              className="text-sm sm:text-base w-full"
            />
          </div>
        ))}
      </div>

      <div>
        <Label
          htmlFor={`answer-${index}`}
          className="text-sm sm:text-base"
        >
          Correct Answer *
        </Label>
        <Select
          value={question.answer}
          onValueChange={onAnswerChange}
        >
          <SelectTrigger
            id={`answer-${index}`}
            className="text-sm sm:text-base w-full"
          >
            <SelectValue placeholder="Select correct answer" />
          </SelectTrigger>
          <SelectContent className="max-w-[90vw] sm:max-w-none">
            {question.options.map((option, optIndex) =>
              option.trim() ? (
                <SelectItem
                  key={optIndex}
                  value={option}
                  className="truncate"
                >
                  <span className="truncate block max-w-full">
                    {option}
                  </span>
                </SelectItem>
              ) : null
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
