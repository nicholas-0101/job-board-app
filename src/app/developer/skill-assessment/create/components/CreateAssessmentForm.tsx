"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Save, Trash2, Plus } from "lucide-react";
import BadgeSelector from "./BadgeSelector";
import QuestionForm from "./QuestionForm";
import { Question } from "@/lib/skillAssessment";

interface CreateAssessmentFormProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  category: string;
  setCategory: (category: string) => void;
  badgeTemplateId: number | undefined;
  setBadgeTemplateId: (id: number | undefined) => void;
  questions: Question[];
  savedQuestions: Set<number>;
  savingQuestion: number | null;
  onAddQuestion: () => void;
  onRemoveQuestion: (index: number) => void;
  onQuestionChange: (index: number, question: Question) => void;
  onSaveQuestion: (index: number) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  unsavedQuestionsCount: number;
}

export default function CreateAssessmentForm({
  title,
  setTitle,
  description,
  setDescription,
  category,
  setCategory,
  badgeTemplateId,
  setBadgeTemplateId,
  questions,
  savedQuestions,
  savingQuestion,
  onAddQuestion,
  onRemoveQuestion,
  onQuestionChange,
  onSaveQuestion,
  onSubmit,
  loading,
  unsavedQuestionsCount,
}: CreateAssessmentFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Assessment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Assessment title"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Assessment description"
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., JavaScript, React, Node.js"
              required
            />
          </div>
          
          <BadgeSelector
            selectedBadgeId={badgeTemplateId}
            onSelect={setBadgeTemplateId}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Questions ({questions.length}/25)</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Questions saved to draft: {savedQuestions.size} of {questions.length}
            </p>
          </div>
          <Button
            type="button"
            onClick={onAddQuestion}
            disabled={questions.length >= 25 || unsavedQuestionsCount > 0}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Question
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {unsavedQuestionsCount > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                Please save all questions before adding new ones or creating the assessment.
              </p>
            </div>
          )}
          
          {questions.map((question, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Question {index + 1}</h4>
                <div className="flex items-center gap-2">
                  {savedQuestions.has(index) ? (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <Check className="w-3 h-3 mr-1" />
                      Saved
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Unsaved</Badge>
                  )}
                  <Button
                    type="button"
                    onClick={() => onSaveQuestion(index)}
                    disabled={savingQuestion === index || savedQuestions.has(index)}
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Save className="w-3 h-3" />
                    {savingQuestion === index ? "Saving..." : "Save Question"}
                  </Button>
                  {questions.length < 25 && index === questions.length - 1 && (
                    <Button
                      type="button"
                      onClick={onAddQuestion}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Add Question
                    </Button>
                  )}
                  <Button
                    type="button"
                    onClick={() => onRemoveQuestion(index)}
                    variant="destructive"
                    size="sm"
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
                canRemove={questions.length > 1}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading || unsavedQuestionsCount > 0}
          className="flex items-center gap-2"
        >
          {loading ? "Creating..." : "Create Assessment"}
        </Button>
      </div>
    </form>
  );
}
