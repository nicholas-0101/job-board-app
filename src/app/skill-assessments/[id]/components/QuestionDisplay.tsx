"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

interface Question {
  id: number;
  question: string;
  options: string[];
}

interface QuestionDisplayProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  selectedAnswer?: string;
  onAnswerChange: (questionId: number, answer: string) => void;
}

export default function QuestionDisplay({
  question,
  questionIndex,
  totalQuestions,
  selectedAnswer,
  onAnswerChange,
}: QuestionDisplayProps) {
  const progress = ((questionIndex + 1) / totalQuestions) * 100;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-lg">
            Question {questionIndex + 1} of {totalQuestions}
          </CardTitle>
          <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900 leading-relaxed">
            {question.question}
          </h3>
          
          <RadioGroup
            value={selectedAnswer || ""}
            onValueChange={(value) => onAnswerChange(question.id, value)}
            className="space-y-3"
          >
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <RadioGroupItem 
                  value={option} 
                  id={`option-${optionIndex}`}
                  className="text-[#467EC7]"
                />
                <Label 
                  htmlFor={`option-${optionIndex}`} 
                  className="flex-1 text-sm font-medium cursor-pointer"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}
