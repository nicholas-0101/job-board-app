"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Save, Check } from "lucide-react";
import BadgeSelector from "../../../create/components/BadgeSelector";
import QuestionForm from "../../../create/components/QuestionForm";
import { Question } from "@/lib/skillAssessment";

interface EditAssessmentFormProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
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

export default function EditAssessmentForm({
  title,
  setTitle,
  description,
  setDescription,
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
}: EditAssessmentFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card className="bg-white shadow-lg" style={{ borderColor: '#E1F1F3' }}>
        <CardHeader className="text-white" style={{ backgroundColor: '#467EC7' }}>
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
          
          <BadgeSelector
            selectedBadgeId={badgeTemplateId}
            onSelect={setBadgeTemplateId}
          />
        </CardContent>
      </Card>

      <Card className="bg-white shadow-lg" style={{ borderColor: '#E1F1F3' }}>
        <CardHeader className="flex flex-row items-center justify-between text-white" style={{ backgroundColor: '#467EC7' }}>
          <div>
            <CardTitle>Questions ({questions.length})</CardTitle>
            <p className="text-sm mt-1" style={{ color: '#E1F1F3' }}>
              Questions saved to draft: {savedQuestions.size} of {questions.length}
            </p>
          </div>
          <Button
            type="button"
            onClick={onAddQuestion}
            disabled={unsavedQuestionsCount > 0}
            className="flex items-center gap-2 text-white"
            style={{ backgroundColor: '#24CFA7' }}
          >
            <Plus className="w-4 h-4" />
            Add Question
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {unsavedQuestionsCount > 0 && (
            <div className="rounded-lg p-3" style={{ backgroundColor: '#E1F1F3', borderColor: '#A3B6CE' }}>
              <p className="text-sm" style={{ color: '#467EC7' }}>
                Please save all questions before adding new ones or updating the assessment.
              </p>
            </div>
          )}
          
          {questions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No questions added yet</p>
              <Button
                type="button"
                onClick={onAddQuestion}
                className="flex items-center gap-2 mx-auto text-white"
                style={{ backgroundColor: '#24CFA7' }}
              >
                <Plus className="w-4 h-4" />
                Add First Question
              </Button>
            </div>
          ) : (
            questions.map((question, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4 bg-white" style={{ borderColor: '#E1F1F3' }}>
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Question {index + 1}</h4>
                <div className="flex items-center gap-2">
                  {savedQuestions.has(index) ? (
                    <Badge variant="default" className="text-white" style={{ backgroundColor: '#24CFA7' }}>
                      <Check className="w-3 h-3 mr-1" />
                      Saved
                    </Badge>
                  ) : (
                    <Badge variant="secondary" style={{ backgroundColor: '#A3B6CE', color: 'white' }}>Unsaved</Badge>
                  )}
                  <Button
                    type="button"
                    onClick={() => onSaveQuestion(index)}
                    disabled={savingQuestion === index || savedQuestions.has(index)}
                    size="sm"
                    className="flex items-center gap-1 text-white"
                    style={{ backgroundColor: '#467EC7' }}
                  >
                    <Save className="w-3 h-3" />
                    {savingQuestion === index ? "Saving..." : "Save Question"}
                  </Button>
                  {index === questions.length - 1 && (
                    <Button
                      type="button"
                      onClick={onAddQuestion}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1 text-white"
                      style={{ backgroundColor: '#24CFA7', borderColor: '#24CFA7' }}
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
                canRemove={true}
              />
            </div>
          ))
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading || unsavedQuestionsCount > 0}
          className="flex items-center gap-2 text-white"
          style={{ backgroundColor: '#467EC7' }}
        >
          {loading ? "Updating..." : "Update Assessment"}
        </Button>
      </div>
    </form>
  );
}
