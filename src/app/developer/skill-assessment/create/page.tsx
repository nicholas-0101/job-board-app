"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DeveloperAuthGuard from "@/components/auth/DeveloperAuthGuard";
import DeveloperLayout from "../../components/DeveloperLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";
import CreateAssessmentForm from "./components/CreateAssessmentForm";
import { useCreateAssessment } from "./hooks/useCreateAssessment";
import { useQuestionHandlers } from "./hooks/useQuestionHandlers";
import { saveToStorage } from "./utils/localStorage";

export default function CreateAssessmentPage() {
  const router = useRouter();
  
  const {
    loading,
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
    setQuestions,
    savedQuestions,
    setSavedQuestions,
    handleSubmit,
  } = useCreateAssessment();

  const {
    savingQuestion,
    handleAddQuestion,
    handleRemoveQuestion,
    handleQuestionChange,
    handleSaveQuestion,
  } = useQuestionHandlers(questions, setQuestions, savedQuestions, setSavedQuestions);

  // Auto-save to localStorage whenever form data changes
  useEffect(() => {
    const dataToSave = {
      title,
      description,
      category,
      badgeTemplateId,
      passScore,
      questions,
      savedQuestions: Array.from(savedQuestions),
      lastSaved: new Date().toISOString(),
    };
    
    if (title.trim() || description.trim() || category.trim() || questions.some(q => q.question.trim())) {
      saveToStorage(dataToSave);
    }
  }, [title, description, category, badgeTemplateId, passScore, questions, savedQuestions]);

  const unsavedQuestionsCount = questions.length - savedQuestions.size;

  return (
    <DeveloperAuthGuard>
      <DeveloperLayout>
        <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push("/developer/skill-assessment")}
                className="flex items-center gap-2 w-fit"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Assessments</span>
                <span className="sm:hidden">Back</span>
              </Button>
              <h1 className="text-xl sm:text-2xl font-bold">Create Assessment</h1>
            </div>
          </div>

          {unsavedQuestionsCount > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs sm:text-sm text-blue-800 font-medium">Changes auto-saved</p>
                <p className="text-xs sm:text-sm text-blue-700 mt-1">
                  Your changes are automatically saved to local storage. You can safely refresh the page.
                </p>
              </div>
            </div>
          )}

          <CreateAssessmentForm
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
            questions={questions}
            savedQuestions={savedQuestions}
            savingQuestion={savingQuestion}
            onAddQuestion={handleAddQuestion}
            onRemoveQuestion={handleRemoveQuestion}
            onQuestionChange={handleQuestionChange}
            onSaveQuestion={handleSaveQuestion}
            onSubmit={handleSubmit}
            loading={loading}
            unsavedQuestionsCount={unsavedQuestionsCount}
          />
        </div>
      </DeveloperLayout>
    </DeveloperAuthGuard>
  );
}
