"use client";
import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import DeveloperAuthGuard from "@/components/auth/DeveloperAuthGuard";
import DeveloperLayout from "../../../components/DeveloperLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";
import EditAssessmentForm from "./components/EditAssessmentForm";
import { useEditAssessment } from "./hooks/useEditAssessment";
import { useQuestionHandlers } from "./hooks/useQuestionHandlers";
import { saveToStorage } from "./utils/localStorage";

export default function EditAssessmentPage() {
  const router = useRouter();
  const params = useParams();
  const assessmentId = params.id as string;

  const {
    loading,
    fetching,
    title,
    setTitle,
    description,
    setDescription,
    passScore,
    setPassScore,
    badgeTemplateId,
    setBadgeTemplateId,
    questions,
    setQuestions,
    savedQuestions,
    setSavedQuestions,
    originalData,
    fetchAssessment,
    handleSubmit,
  } = useEditAssessment(assessmentId);

  const {
    savingQuestion,
    handleAddQuestion,
    handleRemoveQuestion,
    handleQuestionChange,
    handleSaveQuestion,
  } = useQuestionHandlers(
    questions,
    setQuestions,
    savedQuestions,
    setSavedQuestions
  );

  useEffect(() => {
    fetchAssessment();
  }, [assessmentId]);

  // Auto-save to localStorage whenever form data changes
  useEffect(() => {
    if (!originalData || fetching) return;

    const dataToSave = {
      title,
      description,
      passScore,
      badgeTemplateId,
      questions,
      savedQuestions: Array.from(savedQuestions),
      lastSaved: new Date().toISOString(),
    };

    const hasChanges =
      title !== originalData.title ||
      description !== originalData.description ||
      passScore !== originalData.passScore ||
      badgeTemplateId !== originalData.badgeTemplateId ||
      JSON.stringify(questions) !== JSON.stringify(originalData.questions);

    if (hasChanges) {
      saveToStorage(assessmentId, dataToSave);
    }
  }, [
    title,
    description,
    passScore,
    badgeTemplateId,
    questions,
    savedQuestions,
    originalData,
    fetching,
    assessmentId,
  ]);

  const unsavedQuestionsCount = questions.length - savedQuestions.size;

  if (fetching) {
    return (
      <DeveloperAuthGuard>
        <DeveloperLayout>
          <div className="flex items-center justify-center min-h-[400px] p-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-sm sm:text-base text-gray-600">Loading assessment...</p>
            </div>
          </div>
        </DeveloperLayout>
      </DeveloperAuthGuard>
    );
  }

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
              <h1 className="text-xl sm:text-2xl font-bold">Edit Assessment</h1>
            </div>
          </div>

          {unsavedQuestionsCount > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs sm:text-sm text-blue-800 font-medium">
                  Changes auto-saved
                </p>
                <p className="text-xs sm:text-sm text-blue-700 mt-1">
                  Your changes are automatically saved to local storage. You can
                  safely refresh the page.
                </p>
              </div>
            </div>
          )}

          <EditAssessmentForm
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            passScore={passScore}
            setPassScore={setPassScore}
            badgeTemplateId={badgeTemplateId}
            setBadgeTemplateId={setBadgeTemplateId}
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
