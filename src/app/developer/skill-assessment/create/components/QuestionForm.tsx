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
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-4">
            <div>
              <Label htmlFor={`question-${index}`}>
                Question {index + 1} *
              </Label>
              <Input
                id={`question-${index}`}
                value={question.question}
                onChange={(e) => handleQuestionTextChange(e.target.value)}
                placeholder="Enter your question"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {question.options.map((option, optIndex) => (
                <div key={optIndex}>
                  <Label htmlFor={`option-${index}-${optIndex}`}>
                    Option {String.fromCharCode(65 + optIndex)} *
                  </Label>
                  <Input
                    id={`option-${index}-${optIndex}`}
                    value={option}
                    onChange={(e) => handleOptionChange(optIndex, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                    required
                  />
                </div>
              ))}
            </div>

            <div>
              <Label htmlFor={`answer-${index}`}>Correct Answer *</Label>
              <Select value={question.answer} onValueChange={handleAnswerChange}>
                <SelectTrigger id={`answer-${index}`}>
                  <SelectValue placeholder="Select correct answer" />
                </SelectTrigger>
                <SelectContent>
                  {question.options.map((option, optIndex) => 
                    option.trim() ? (
                      <SelectItem key={optIndex} value={option}>
                        {option}
                      </SelectItem>
                    ) : null
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3 mt-6">
            <div className="flex items-center gap-2">
              {onSave && (
                <Button
                  type="button"
                  variant={isSaved ? "outline" : "default"}
                  size="sm"
                  onClick={() => onSave(index)}
                  disabled={isSaving}
                  className={isSaved ? "text-green-600 border-green-600" : "bg-[#467EC7] hover:bg-[#467EC7]/90"}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      Saving...
                    </>
                  ) : isSaved ? (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-1" />
                      Save Question
                    </>
                  )}
                </Button>
              )}
              {canRemove && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => onRemove(index)}
                >
                  <Trash2 className="w-4 h-4" />
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
                  className="bg-gray-800 hover:bg-gray-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Next Question
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
