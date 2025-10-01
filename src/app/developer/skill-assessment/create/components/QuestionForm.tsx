"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
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
  canRemove: boolean;
}

export default function QuestionForm({
  index,
  question,
  onChange,
  onRemove,
  canRemove,
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

          {canRemove && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => onRemove(index)}
              className="mt-6"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
