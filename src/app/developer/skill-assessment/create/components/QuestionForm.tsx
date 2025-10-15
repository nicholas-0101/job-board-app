"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Question } from "@/lib/skillAssessment";
import { QuestionFields } from "./QuestionFields";
import { QuestionActions } from "./QuestionActions";

interface QuestionFormProps {
  index: number;
  question: Question;
  onChange: (index: number, question: Question) => void;
  onRemove: (index: number) => void;
  onSave?: (index: number) => void;
  onAddQuestion?: () => void;
  canRemove: boolean;
  isSaved?: boolean;
  isSaving?: boolean;
  isLastQuestion?: boolean;
  canAddMore?: boolean;
}

export default function QuestionForm({
  index,
  question,
  onChange,
  onRemove,
  onSave,
  onAddQuestion,
  canRemove,
  isSaved = false,
  isSaving = false,
  isLastQuestion = false,
  canAddMore = false,
}: QuestionFormProps) {
  const handleQuestionTextChange = (value: string) => {
    onChange(index, { ...question, question: value });
  };

  const handleOptionChange = (optionIndex: number, value: string) => {
    const newOptions = [...question.options];
    newOptions[optionIndex] = value;
    onChange(index, { ...question, options: newOptions });
  };

  const handleAnswerChange = (value: string) => {
    onChange(index, { ...question, answer: value });
  };

  return (
    <Card className="border-l-4 border-l-[#467EC7]">
      <CardContent className="pt-4 sm:pt-6 space-y-3 sm:space-y-4 p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <QuestionFields
            index={index}
            question={question}
            onQuestionTextChange={handleQuestionTextChange}
            onOptionChange={handleOptionChange}
            onAnswerChange={handleAnswerChange}
          />

          <QuestionActions
            index={index}
            isSaved={isSaved}
            isSaving={isSaving}
            isLastQuestion={isLastQuestion}
            canAddMore={canAddMore}
            canRemove={canRemove}
            onSave={onSave}
            onRemove={onRemove}
            onAddQuestion={onAddQuestion}
          />
        </div>
      </CardContent>
    </Card>
  );
}
