"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Save, Trash2, Plus } from "lucide-react";
import { Question } from "@/lib/skillAssessment";
import QuestionForm from "./QuestionForm";

interface QuestionsCardProps {
  questions: Question[];
  savedQuestions: Set<number>;
  savingQuestion: number | null;
  unsavedQuestionsCount: number;
  onAddQuestion: () => void;
  onRemoveQuestion: (index: number) => void;
  onQuestionChange: (index: number, question: Question) => void;
  onSaveQuestion: (index: number) => void;
}

export function QuestionsCard({
  questions,
  savedQuestions,
  savingQuestion,
  unsavedQuestionsCount,
  onAddQuestion,
  onRemoveQuestion,
  onQuestionChange,
  onSaveQuestion,
}: QuestionsCardProps) {
  return (
    <Card className="bg-white shadow-lg" style={{ borderColor: "#E1F1F3" }}>
      <CardHeader
        className="text-white"
        style={{ backgroundColor: "#467EC7" }}
      >
        <div>
          <CardTitle className="text-base sm:text-lg">
            Questions ({questions.length})
          </CardTitle>
          <p className="text-xs sm:text-sm mt-1" style={{ color: "#E1F1F3" }}>
            Questions saved to draft: {savedQuestions.size} of{" "}
            {questions.length}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
        {unsavedQuestionsCount > 0 && (
          <div
            className="rounded-lg p-3"
            style={{ backgroundColor: "#E1F1F3", borderColor: "#A3B6CE" }}
          >
            <p className="text-xs sm:text-sm" style={{ color: "#467EC7" }}>
              Please save all questions before adding new ones or creating the
              assessment.
            </p>
          </div>
        )}

        {questions.length === 0 ? (
          <div className="text-center py-6 sm:py-8">
            <p className="text-sm sm:text-base text-gray-500 mb-4">
              No questions added yet
            </p>
            <Button
              type="button"
              onClick={onAddQuestion}
              className="flex items-center gap-2 mx-auto text-white text-sm sm:text-base"
              style={{ backgroundColor: "#24CFA7" }}
            >
              <Plus className="w-4 h-4" />
              Add First Question
            </Button>
          </div>
        ) : (
          questions.map((question, index) => (
            <div
              key={index}
              className="border rounded-lg p-3 sm:p-4 space-y-3 sm:space-y-4 bg-white"
              style={{ borderColor: "#E1F1F3" }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h4 className="font-medium text-sm sm:text-base">
                  Question {index + 1}
                </h4>
                <div className="flex items-center gap-2 flex-wrap">
                  {savedQuestions.has(index) ? (
                    <Badge
                      variant="default"
                      className="text-white text-xs"
                      style={{ backgroundColor: "#24CFA7" }}
                    >
                      <Check className="w-3 h-3 mr-1" />
                      Saved
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="text-xs"
                      style={{ backgroundColor: "#A3B6CE", color: "white" }}
                    >
                      Unsaved
                    </Badge>
                  )}
                  <Button
                    type="button"
                    onClick={() => onSaveQuestion(index)}
                    disabled={
                      savingQuestion === index || savedQuestions.has(index)
                    }
                    size="sm"
                    className="flex items-center gap-1 text-white text-xs sm:text-sm"
                    style={{ backgroundColor: "#467EC7" }}
                  >
                    <Save className="w-3 h-3" />
                    <span className="hidden sm:inline">
                      {savingQuestion === index
                        ? "Saving..."
                        : "Save Question"}
                    </span>
                    <span className="sm:hidden">
                      {savingQuestion === index ? "Saving..." : "Save"}
                    </span>
                  </Button>
                  {index === questions.length - 1 && (
                    <Button
                      type="button"
                      onClick={onAddQuestion}
                      variant="outline"
                      size="sm"
                      disabled={!savedQuestions.has(index)}
                      className="flex items-center gap-1 text-white text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: "#24CFA7",
                        borderColor: "#24CFA7",
                      }}
                    >
                      <Plus className="w-3 h-3" />
                      <span className="hidden sm:inline">Add Question</span>
                      <span className="sm:hidden">Add</span>
                    </Button>
                  )}
                  <Button
                    type="button"
                    onClick={() => onRemoveQuestion(index)}
                    variant="destructive"
                    size="sm"
                    className="text-xs sm:text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <QuestionForm
                index={index}
                question={question}
                onChange={onQuestionChange}
                onRemove={onRemoveQuestion}
                canRemove={true}
              />
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
