"use client";
import { Button } from "@/components/ui/button";
import { Question } from "@/lib/skillAssessment";
import { AssessmentDetailsCard } from "./AssessmentDetailsCard";
import { QuestionsCard } from "./QuestionsCard";

interface CreateAssessmentFormProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  category: string;
  setCategory: (category: string) => void;
  badgeTemplateId: number | undefined;
  setBadgeTemplateId: (id: number | undefined) => void;
  passScore: number;
  setPassScore: (score: number) => void;
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
  passScore,
  setPassScore,
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
    <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6">
      <AssessmentDetailsCard
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        category={category}
        setCategory={setCategory}
        badgeTemplateId={badgeTemplateId}
        setBadgeTemplateId={setBadgeTemplateId}
        passScore={passScore}
        setPassScore={setPassScore}
      />

      <QuestionsCard
        questions={questions}
        savedQuestions={savedQuestions}
        savingQuestion={savingQuestion}
        unsavedQuestionsCount={unsavedQuestionsCount}
        onAddQuestion={onAddQuestion}
        onRemoveQuestion={onRemoveQuestion}
        onQuestionChange={onQuestionChange}
        onSaveQuestion={onSaveQuestion}
      />

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading || unsavedQuestionsCount > 0}
          className="flex items-center gap-2 text-white text-sm sm:text-base w-full sm:w-auto"
          style={{ backgroundColor: "#467EC7" }}
        >
          {loading ? "Creating..." : "Create Assessment"}
        </Button>
      </div>
    </form>
  );
}
