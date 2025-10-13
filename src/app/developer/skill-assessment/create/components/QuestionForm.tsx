"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2, Save, Check, Loader2, Plus } from "lucide-react";
import { Question } from "@/lib/skillAssessment";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
                onChange={(e) => handleQuestionTextChange(e.target.value)}
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
                      handleOptionChange(optIndex, e.target.value)
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
                onValueChange={handleAnswerChange}
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

          <div className="space-y-3 mt-4 lg:mt-6 lg:min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              {onSave && (
                <Button
                  type="button"
                  variant={isSaved ? "outline" : "default"}
                  size="sm"
                  onClick={() => onSave(index)}
                  disabled={isSaving}
                  className={`text-xs sm:text-sm ${
                    isSaved
                      ? "text-green-600 border-green-600"
                      : "bg-[#467EC7] hover:bg-[#467EC7]/90"
                  }`}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 animate-spin" />
                      <span className="hidden sm:inline">Saving...</span>
                      <span className="sm:hidden">Saving...</span>
                    </>
                  ) : isSaved ? (
                    <>
                      <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      <span className="hidden sm:inline">Saved</span>
                      <span className="sm:hidden">Saved</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      <span className="hidden sm:inline">Save Question</span>
                      <span className="sm:hidden">Save</span>
                    </>
                  )}
                </Button>
              )}
              {canRemove && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => onRemove(index)}
                  className="text-xs sm:text-sm"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              )}
            </div>

            {/* Add Question button - shows after save and only on last question */}
            {isSaved && isLastQuestion && canAddMore && onAddQuestion && (
              <div className="flex justify-center">
                <Button
                  type="button"
                  onClick={onAddQuestion}
                  size="sm"
                  className="bg-gray-800 hover:bg-gray-700 text-white text-xs sm:text-sm"
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Add Next Question</span>
                  <span className="sm:hidden">Add Next</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
